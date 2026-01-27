import express from 'express';
import Hospital from '../models/Hospital.js';
import Donor from '../models/Donor.js';
import BloodBank from '../models/BloodBank.js';
import Patient from '../models/Patient.js';
import Emergency from '../models/Emergency.js';
import Preservation from '../models/Preservation.js';
import SendRecord from '../models/SendRecord.js';

const router = express.Router();

// @route   GET /api/stats/overview
// @desc    Get aggregated stats for dashboards
// @access  Public (should be protected in production)
router.get('/overview', async (req, res) => {
  try {
    // Count totals
    const totalHospitals = await Hospital.countDocuments();
    const totalDonors = await Donor.countDocuments({ verified: true });
    const totalBloodBanks = await BloodBank.countDocuments({ verified: true });
    const totalPatients = await Patient.countDocuments();
    const activeEmergencies = await Emergency.countDocuments({ status: 'Active' });

    // Blood type distribution from patients
    const patients = await Patient.find();
    const bloodTypeDistribution = patients.reduce((acc, patient) => {
      acc[patient.bloodType] = (acc[patient.bloodType] || 0) + 1;
      return acc;
    }, {});

    // Total stock across all blood banks
    const preservations = await Preservation.find({ status: 'Available' });
    const totalStock = preservations.reduce((sum, p) => sum + p.units, 0);

    // Stock by blood type
    const stockByType = preservations.reduce((acc, p) => {
      acc[p.bloodType] = (acc[p.bloodType] || 0) + p.units;
      return acc;
    }, {});

    // Recent emergencies
    const recentEmergencies = await Emergency.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('bloodType unitsNeeded city creatorName status createdAt');

    // Delivery success rate
    const allSendRecords = await SendRecord.find();
    const deliveredCount = allSendRecords.filter(r => r.status === 'Delivered').length;
    const successRate = allSendRecords.length > 0
      ? ((deliveredCount / allSendRecords.length) * 100).toFixed(1)
      : 0;

    res.json({
      totals: {
        hospitals: totalHospitals,
        donors: totalDonors,
        bloodBanks: totalBloodBanks,
        patients: totalPatients,
        activeEmergencies,
        totalStock
      },
      bloodTypeDistribution,
      stockByType,
      recentEmergencies,
      successRate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/stats/city/:city
// @desc    Get stats for a specific city
// @access  Public
router.get('/city/:city', async (req, res) => {
  try {
    const { city } = req.params;

    const hospitals = await Hospital.countDocuments({ city });
    const donors = await Donor.countDocuments({ city, verified: true });
    const bloodBanks = await BloodBank.countDocuments({ city, verified: true });
    const activeEmergencies = await Emergency.countDocuments({ city, status: 'Active' });

    res.json({
      city,
      hospitals,
      donors,
      bloodBanks,
      activeEmergencies
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;