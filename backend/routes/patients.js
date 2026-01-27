import express from 'express';
import PatientUser from '../models/PatientUser.js';
import BloodRequest from '../models/BloodRequest.js';
import BloodBank from '../models/BloodBank.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/patients/:id
// @desc    Get patient profile
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const patient = await PatientUser.findById(req.params.id).select('-password');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/patients/:id
// @desc    Update patient profile
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, phone, age, bloodGroup, city, location, emergencyContact } = req.body;

    const patient = await PatientUser.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Update fields
    if (name) patient.name = name;
    if (phone) patient.phone = phone;
    if (age) patient.age = age;
    if (bloodGroup) patient.bloodGroup = bloodGroup;
    if (city) patient.city = city;
    if (location) patient.location = location;
    if (emergencyContact) patient.emergencyContact = emergencyContact;

    await patient.save();

    res.json({
      id: patient._id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      age: patient.age,
      bloodGroup: patient.bloodGroup,
      city: patient.city,
      location: patient.location,
      emergencyContact: patient.emergencyContact
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/patients/:id/blood-request
// @desc    Create a blood request
// @access  Private
router.post('/:id/blood-request', protect, async (req, res) => {
  try {
    const { patientName, age, bloodGroup, unitsNeeded, phone, urgencyLevel, description } = req.body;

    const patient = await PatientUser.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Create blood request
    const bloodRequest = await BloodRequest.create({
      patient: patient._id,
      patientName: patientName || patient.name,
      age: age || patient.age,
      bloodGroup: bloodGroup || patient.bloodGroup,
      unitsNeeded,
      phone: phone || patient.phone,
      city: patient.city,
      location: patient.location,
      urgencyLevel: urgencyLevel || 'Medium',
      description
    });

    // Add to patient's blood requests
    patient.bloodRequests.push(bloodRequest._id);
    await patient.save();

    // Broadcast to nearby blood banks via Socket.IO
    const io = req.app.get('io');
    if (io) {
      const notificationPayload = {
        bloodRequest: {
          id: bloodRequest._id,
          patientName: bloodRequest.patientName,
          age: bloodRequest.age,
          bloodGroup: bloodRequest.bloodGroup,
          unitsNeeded: bloodRequest.unitsNeeded,
          phone: bloodRequest.phone,
          city: bloodRequest.city,
          location: bloodRequest.location,
          urgencyLevel: bloodRequest.urgencyLevel,
          description: bloodRequest.description,
          status: bloodRequest.status,
          createdAt: bloodRequest.createdAt
        }
      };

      // Broadcast to blood banks in the same city and all blood banks
      io.to(`city:${patient.city}`).emit('blood.request.created', notificationPayload);
      io.to('role:bloodbank').emit('blood.request.created', notificationPayload);
      
      console.log(`Blood request broadcast to city:${patient.city} and role:bloodbank`);
    }

    res.status(201).json(bloodRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/patients/:id/blood-requests
// @desc    Get patient's blood requests
// @access  Private
router.get('/:id/blood-requests', protect, async (req, res) => {
  try {
    const bloodRequests = await BloodRequest.find({ patient: req.params.id })
      .populate('acceptedBy.bloodBank', 'name contactPhone location')
      .sort({ createdAt: -1 });

    res.json(bloodRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/patients/:id/nearby-bloodbanks
// @desc    Get nearby blood banks
// @access  Private
router.get('/:id/nearby-bloodbanks', protect, async (req, res) => {
  try {
    const patient = await PatientUser.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Find blood banks in the same city
    const bloodBanks = await BloodBank.find({ 
      city: patient.city,
      verified: true 
    }).select('name location city contactPhone contactEmail');

    res.json(bloodBanks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/patients/:id/blood-request/:requestId/cancel
// @desc    Cancel a blood request
// @access  Private
router.put('/:id/blood-request/:requestId/cancel', protect, async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const bloodRequest = await BloodRequest.findOne({
      _id: req.params.requestId,
      patient: req.params.id
    });

    if (!bloodRequest) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    if (bloodRequest.status === 'Fulfilled' || bloodRequest.status === 'Cancelled') {
      return res.status(400).json({ message: 'Cannot cancel this request' });
    }

    bloodRequest.status = 'Cancelled';
    bloodRequest.cancelledAt = new Date();
    bloodRequest.cancellationReason = cancellationReason || 'Cancelled by patient';
    await bloodRequest.save();

    // Notify blood banks about cancellation
    const io = req.app.get('io');
    if (io) {
      io.to(`city:${bloodRequest.city}`).emit('blood.request.cancelled', {
        requestId: bloodRequest._id,
        reason: bloodRequest.cancellationReason
      });
    }

    res.json(bloodRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;