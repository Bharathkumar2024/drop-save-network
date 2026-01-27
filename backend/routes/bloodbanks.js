import express from 'express';
import BloodBank from '../models/BloodBank.js';
import Preservation from '../models/Preservation.js';
import SendRecord from '../models/SendRecord.js';
import Emergency from '../models/Emergency.js';
import Hospital from '../models/Hospital.js';
import BloodRequest from '../models/BloodRequest.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/bloodbanks/:id/dashboard
// @desc    Get blood bank dashboard data
// @access  Private (BloodBank)
router.get('/:id/dashboard', protect, authorize('bloodbank'), async (req, res) => {
  try {
    const bloodBank = await BloodBank.findById(req.params.id);
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank not found' });
    }

    // Get preservation inventory
    const preservations = await Preservation.find({
      bloodBank: req.params.id,
      status: { $in: ['Available', 'Reserved'] }
    }).sort({ expiryDate: 1 });

    // Get send records
    const sendRecords = await SendRecord.find({
      bloodBank: req.params.id
    })
    .populate('recipient', 'name location')
    .sort({ createdAt: -1 })
    .limit(20);

    // Calculate stock by blood type
    const stockByType = preservations.reduce((acc, pres) => {
      if (pres.status === 'Available') {
        acc[pres.bloodType] = (acc[pres.bloodType] || 0) + pres.units;
      }
      return acc;
    }, {});

    // Calculate total stock
    const totalStock = Object.values(stockByType).reduce((sum, units) => sum + units, 0);

    // Calculate success rate
    const deliveredRecords = sendRecords.filter(r => r.status === 'Delivered').length;
    const successRate = sendRecords.length > 0 
      ? ((deliveredRecords / sendRecords.length) * 100).toFixed(1)
      : 0;

    // Find near-expiry items (within 7 days)
    const nearExpiry = preservations.filter(p => {
      const daysUntilExpiry = Math.ceil((p.expiryDate - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
    });

    res.json({
      bloodBank: {
        id: bloodBank._id,
        name: bloodBank.name,
        location: bloodBank.location,
        city: bloodBank.city
      },
      stats: {
        totalStock,
        totalDispatched: bloodBank.stats.totalDispatched,
        successRate,
        nearExpiryCount: nearExpiry.length
      },
      stockByType,
      preservations,
      sendRecords,
      nearExpiry
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/bloodbanks/:id/preservation
// @desc    Add new preservation batch
// @access  Private (BloodBank)
router.post('/:id/preservation', protect, authorize('bloodbank'), async (req, res) => {
  try {
    const { bloodType, units, collectionDate, expiryDate, storageLocation, donorInfo } = req.body;

    // Generate unique batch ID
    const batchId = 'BATCH-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    const preservation = await Preservation.create({
      bloodBank: req.params.id,
      batchId,
      bloodType,
      units,
      collectionDate: collectionDate || new Date(),
      expiryDate,
      storageLocation: storageLocation || '',
      donorInfo: donorInfo || {}
    });

    // Update blood bank stats
    await BloodBank.findByIdAndUpdate(req.params.id, {
      $inc: { 'stats.totalStock': units }
    });

    res.status(201).json(preservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bloodbanks/:id/preservation
// @desc    Get all preservation batches
// @access  Private (BloodBank)
router.get('/:id/preservation', protect, authorize('bloodbank'), async (req, res) => {
  try {
    const { status, bloodType } = req.query;
    
    const filter = { bloodBank: req.params.id };
    if (status) filter.status = status;
    if (bloodType) filter.bloodType = bloodType;

    const preservations = await Preservation.find(filter).sort({ expiryDate: 1 });
    
    res.json(preservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/bloodbanks/:id/preservation/:pid
// @desc    Update preservation batch
// @access  Private (BloodBank)
router.patch('/:id/preservation/:pid', protect, authorize('bloodbank'), async (req, res) => {
  try {
    const { status, units } = req.body;

    const preservation = await Preservation.findOne({
      _id: req.params.pid,
      bloodBank: req.params.id
    });

    if (!preservation) {
      return res.status(404).json({ message: 'Preservation batch not found' });
    }

    if (status) preservation.status = status;
    if (units !== undefined) preservation.units = units;

    await preservation.save();

    res.json(preservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/bloodbanks/:id/dispatch
// @desc    Create dispatch/send record
// @access  Private (BloodBank)
router.post('/:id/dispatch', protect, authorize('bloodbank'), async (req, res) => {
  try {
    const {
      preservationId,
      recipientId,
      recipientModel,
      units,
      expectedDelivery,
      notes,
      emergencyId
    } = req.body;

    // Validate preservation batch
    const preservation = await Preservation.findOne({
      _id: preservationId,
      bloodBank: req.params.id
    });

    if (!preservation) {
      return res.status(404).json({ message: 'Preservation batch not found' });
    }

    if (preservation.status !== 'Available') {
      return res.status(400).json({ message: 'Preservation batch is not available' });
    }

    if (preservation.units < units) {
      return res.status(400).json({ message: 'Insufficient units in batch' });
    }

    // Get recipient name
    let recipientName;
    if (recipientModel === 'Hospital') {
      const hospital = await Hospital.findById(recipientId);
      if (!hospital) {
        return res.status(404).json({ message: 'Hospital not found' });
      }
      recipientName = hospital.name;
    } else if (recipientModel === 'BloodBank') {
      const bank = await BloodBank.findById(recipientId);
      if (!bank) {
        return res.status(404).json({ message: 'Blood bank not found' });
      }
      recipientName = bank.name;
    }

    // Create send record
    const sendRecord = await SendRecord.create({
      bloodBank: req.params.id,
      preservation: preservationId,
      recipient: recipientId,
      recipientModel,
      recipientName,
      bloodType: preservation.bloodType,
      units,
      expectedDelivery,
      notes: notes || '',
      emergency: emergencyId || null,
      status: 'Pending'
    });

    // Update preservation batch
    preservation.units -= units;
    if (preservation.units === 0) {
      preservation.status = 'Dispatched';
    } else {
      preservation.status = 'Reserved';
    }
    await preservation.save();

    // Update blood bank stats
    await BloodBank.findByIdAndUpdate(req.params.id, {
      $inc: {
        'stats.totalDispatched': units,
        'stats.totalStock': -units
      }
    });

    // If linked to emergency, update emergency
    if (emergencyId) {
      await Emergency.findByIdAndUpdate(emergencyId, {
        $inc: { unitsReceived: units }
      });
    }

    res.status(201).json(sendRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bloodbanks/:id/send-records
// @desc    Get all send records
// @access  Private (BloodBank)
router.get('/:id/send-records', protect, authorize('bloodbank'), async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = { bloodBank: req.params.id };
    if (status) filter.status = status;

    const sendRecords = await SendRecord.find(filter)
      .populate('recipient', 'name location')
      .populate('preservation', 'batchId bloodType')
      .sort({ createdAt: -1 });

    res.json(sendRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/bloodbanks/:id/send-records/:sid
// @desc    Update send record status
// @access  Private (BloodBank)
router.patch('/:id/send-records/:sid', protect, authorize('bloodbank'), async (req, res) => {
  try {
    const { status, actualDelivery } = req.body;

    const sendRecord = await SendRecord.findOne({
      _id: req.params.sid,
      bloodBank: req.params.id
    });

    if (!sendRecord) {
      return res.status(404).json({ message: 'Send record not found' });
    }

    if (status) sendRecord.status = status;
    if (actualDelivery) sendRecord.actualDelivery = actualDelivery;

    // If delivered, update success stats
    if (status === 'Delivered') {
      await BloodBank.findByIdAndUpdate(req.params.id, {
        $inc: { 'stats.successfulSends': 1 }
      });
    }

    await sendRecord.save();

    res.json(sendRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/bloodbanks/:id/emergency
// @desc    Create emergency request (blood bank issuing emergency)
// @access  Private (BloodBank)
router.post('/:id/emergency', protect, authorize('bloodbank'), async (req, res) => {
  try {
    const { bloodType, unitsNeeded, description, priority } = req.body;

    const bloodBank = await BloodBank.findById(req.params.id);
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank not found' });
    }

    const emergency = await Emergency.create({
      createdBy: req.params.id,
      creatorModel: 'BloodBank',
      creatorName: bloodBank.name,
      bloodType,
      unitsNeeded,
      city: bloodBank.city,
      location: bloodBank.location,
      contactPhone: bloodBank.contactPhone,
      description: description || '',
      priority: priority || 'High'
    });

    // Emit socket event to notify donors and blood banks
    const io = req.app.get('io');
    const emergencyPayload = {
      emergency: {
        id: emergency._id,
        bloodType: emergency.bloodType,
        unitsNeeded: emergency.unitsNeeded,
        unitsRequired: emergency.unitsNeeded,
        city: emergency.city,
        location: emergency.location,
        creatorName: emergency.creatorName,
        requesterName: emergency.creatorName,
        hospitalName: emergency.creatorName,
        priority: emergency.priority,
        status: emergency.status,
        createdAt: emergency.createdAt
      }
    };

    // Broadcast to donors and blood banks in the same city
    io.to(`city:${bloodBank.city}`).emit('emergency.created', emergencyPayload);
    
    // Also broadcast to all donors and blood banks regardless of city (for wider reach)
    io.to('role:donor').emit('emergency.created', emergencyPayload);
    io.to('role:bloodbank').emit('emergency.created', emergencyPayload);
    
    console.log(`Emergency broadcast to city:${bloodBank.city}, role:donor, and role:bloodbank`);

    res.status(201).json(emergency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bloodbanks/:id/blood-requests
// @desc    Get blood requests for blood bank (from patients)
// @access  Private (BloodBank)
router.get('/:id/blood-requests', protect, authorize('bloodbank'), async (req, res) => {
  try {
    const bloodBank = await BloodBank.findById(req.params.id);
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank not found' });
    }

    // Get blood requests from the same city
    const bloodRequests = await BloodRequest.find({
      city: bloodBank.city,
      status: { $in: ['Pending', 'Accepted'] }
    })
    .populate('patient', 'name email')
    .sort({ createdAt: -1 });

    res.json(bloodRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/bloodbanks/:id/blood-requests/:requestId/accept
// @desc    Accept a blood request from patient
// @access  Private (BloodBank)
router.post('/:id/blood-requests/:requestId/accept', protect, authorize('bloodbank'), async (req, res) => {
  try {
    const bloodBank = await BloodBank.findById(req.params.id);
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank not found' });
    }

    const bloodRequest = await BloodRequest.findById(req.params.requestId)
      .populate('patient', 'name email phone');
    
    if (!bloodRequest) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    if (bloodRequest.status !== 'Pending') {
      return res.status(400).json({ message: 'Blood request already processed' });
    }

    // Update blood request
    bloodRequest.status = 'Accepted';
    bloodRequest.acceptedBy = {
      bloodBank: bloodBank._id,
      bloodBankName: bloodBank.name,
      acceptedAt: new Date()
    };
    await bloodRequest.save();

    // Notify patient via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${bloodRequest.patient._id}`).emit('blood.request.accepted', {
        requestId: bloodRequest._id,
        bloodBank: {
          id: bloodBank._id,
          name: bloodBank.name,
          phone: bloodBank.contactPhone,
          location: bloodBank.location
        },
        message: `${bloodBank.name} has accepted your blood request`
      });
      
      console.log(`Blood request acceptance notification sent to patient ${bloodRequest.patient._id}`);
    }

    res.json({
      message: 'Blood request accepted successfully',
      bloodRequest,
      patientContact: {
        name: bloodRequest.patient.name,
        phone: bloodRequest.patient.phone || bloodRequest.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;