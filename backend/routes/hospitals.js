import express from 'express';
import Hospital from '../models/Hospital.js';
import Patient from '../models/Patient.js';
import Emergency from '../models/Emergency.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/hospitals/:id/dashboard
// @desc    Get hospital dashboard data
// @access  Private (Hospital)
router.get('/:id/dashboard', protect, authorize('hospital'), async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Get patients
    const patients = await Patient.find({ hospital: req.params.id }).sort({ createdAt: -1 });
    
    // Get active emergencies
    const emergencies = await Emergency.find({
      createdBy: req.params.id,
      creatorModel: 'Hospital',
      status: 'Active'
    }).sort({ createdAt: -1 });

    // Calculate stats
    const totalPatients = patients.length;
    const patientsRequesting = patients.filter(p => p.status === 'Requesting').length;
    const patientsReceived = patients.filter(p => p.status === 'Received').length;
    const receivedPercentage = totalPatients > 0 ? ((patientsReceived / totalPatients) * 100).toFixed(1) : 0;

    // Blood type distribution
    const bloodTypeDistribution = patients.reduce((acc, patient) => {
      acc[patient.bloodType] = (acc[patient.bloodType] || 0) + 1;
      return acc;
    }, {});

    res.json({
      hospital: {
        id: hospital._id,
        name: hospital.name,
        location: hospital.location,
        city: hospital.city
      },
      stats: {
        totalPatients,
        patientsRequesting,
        patientsReceived,
        receivedPercentage,
        activeEmergencies: emergencies.length
      },
      patients,
      emergencies,
      bloodTypeDistribution
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/hospitals/:id/patients
// @desc    Add a new patient
// @access  Private (Hospital)
router.post('/:id/patients', protect, authorize('hospital'), async (req, res) => {
  try {
    const { name, age, room, caseDescription, bloodType, unitsNeeded, priority } = req.body;

    const patient = await Patient.create({
      hospital: req.params.id,
      name,
      age,
      room,
      caseDescription,
      bloodType,
      unitsNeeded,
      priority: priority || 'Medium'
    });

    // Update hospital stats
    await Hospital.findByIdAndUpdate(req.params.id, {
      $inc: { 'stats.totalPatients': 1 }
    });

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/hospitals/:id/patients
// @desc    Get all patients for a hospital
// @access  Private (Hospital)
router.get('/:id/patients', protect, authorize('hospital'), async (req, res) => {
  try {
    const patients = await Patient.find({ hospital: req.params.id }).sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/hospitals/:id/patients/:pid
// @desc    Update patient status/units received
// @access  Private (Hospital)
router.patch('/:id/patients/:pid', protect, authorize('hospital'), async (req, res) => {
  try {
    const { unitsReceived, status } = req.body;

    const patient = await Patient.findOne({
      _id: req.params.pid,
      hospital: req.params.id
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const wasRequesting = patient.status === 'Requesting';

    if (unitsReceived !== undefined) {
      patient.unitsReceived = unitsReceived;
    }
    if (status) {
      patient.status = status;
    }

    await patient.save();

    // Update hospital stats if status changed to Received
    if (wasRequesting && patient.status === 'Received') {
      await Hospital.findByIdAndUpdate(req.params.id, {
        $inc: { 'stats.patientsReceived': 1 }
      });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/hospitals/:id/patients/:pid
// @desc    Delete a patient
// @access  Private (Hospital)
router.delete('/:id/patients/:pid', protect, authorize('hospital'), async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({
      _id: req.params.pid,
      hospital: req.params.id
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Update hospital stats
    await Hospital.findByIdAndUpdate(req.params.id, {
      $inc: { 'stats.totalPatients': -1 }
    });

    res.json({ message: 'Patient removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/hospitals/:id/emergency
// @desc    Create emergency request
// @access  Private (Hospital)
router.post('/:id/emergency', protect, authorize('hospital'), async (req, res) => {
  try {
    const { bloodType, unitsNeeded, description, priority } = req.body;

    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const emergency = await Emergency.create({
      createdBy: req.params.id,
      creatorModel: 'Hospital',
      creatorName: hospital.name,
      bloodType,
      unitsNeeded,
      city: hospital.city,
      location: hospital.location,
      contactPhone: hospital.contactPhone,
      description: description || '',
      priority: priority || 'High'
    });

    // Update hospital stats
    await Hospital.findByIdAndUpdate(req.params.id, {
      $inc: { 'stats.emergenciesCreated': 1 }
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
    io.to(`city:${hospital.city}`).emit('emergency.created', emergencyPayload);
    
    // Also broadcast to all donors and blood banks regardless of city (for wider reach)
    io.to('role:donor').emit('emergency.created', emergencyPayload);
    io.to('role:bloodbank').emit('emergency.created', emergencyPayload);
    
    console.log(`Emergency broadcast to city:${hospital.city}, role:donor, and role:bloodbank`);

    res.status(201).json(emergency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/hospitals/:id/emergency-status
// @desc    Get live emergency status
// @access  Private (Hospital)
router.get('/:id/emergency-status', protect, authorize('hospital'), async (req, res) => {
  try {
    const emergencies = await Emergency.find({
      createdBy: req.params.id,
      creatorModel: 'Hospital',
      status: 'Active'
    })
    .populate('responses.donor', 'name phone bloodGroup')
    .sort({ createdAt: -1 });

    res.json(emergencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;