import express from 'express';
import Hospital from '../models/Hospital.js';
import Donor from '../models/Donor.js';
import BloodBank from '../models/BloodBank.js';
import PatientUser from '../models/PatientUser.js';
import generateToken from '../utils/generateToken.js';
import generateOTP from '../utils/generateOTP.js';
import sendEmail from '../utils/sendEmail.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// @route   POST /api/auth/hospital/signup
// @desc    Register a new hospital
// @access  Public
router.post('/hospital/signup', async (req, res) => {
  try {
    const { name, location, hospitalId, password, contactEmail, contactPhone } = req.body ?? {};

    const normalizedName = typeof name === 'string' ? name.trim() : '';
    const normalizedLocation = typeof location === 'string' ? location.trim() : '';
    const normalizedHospitalId = typeof hospitalId === 'string' ? hospitalId.trim() : '';
    const normalizedPassword = typeof password === 'string' ? password.trim() : '';
    const normalizedEmail = typeof contactEmail === 'string' ? contactEmail.trim().toLowerCase() : '';
    const normalizedPhone = typeof contactPhone === 'string' ? contactPhone.trim() : '';

    const requiredFields = [
      normalizedName,
      normalizedLocation,
      normalizedHospitalId,
      normalizedPassword,
      normalizedEmail,
      normalizedPhone
    ];

    if (requiredFields.some((field) => !field)) {
      return res.status(400).json({ message: 'All fields are required. Please check your entries.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid contact email.' });
    }

    let city = '';
    if (normalizedLocation.includes(',')) {
      city = normalizedLocation.split(',').pop()?.trim() ?? '';
    }
    if (!city) {
      city = normalizedLocation.trim();
    }

    // Check if hospital exists
    const hospitalExists = await Hospital.findOne({ hospitalId: normalizedHospitalId });
    if (hospitalExists) {
      return res.status(400).json({ message: 'Hospital ID already registered.' });
    }

    // Create hospital
    const hospital = await Hospital.create({
      name: normalizedName,
      location: normalizedLocation,
      city,
      hospitalId: normalizedHospitalId,
      password: normalizedPassword,
      contactEmail: normalizedEmail,
      contactPhone: normalizedPhone
    });

    const token = generateToken(hospital._id, 'hospital');

    res.status(201).json({
      token,
      hospital: {
        id: hospital._id,
        name: hospital.name,
        hospitalId: hospital.hospitalId,
        location: hospital.location,
        city: hospital.city,
        contactEmail: hospital.contactEmail,
        contactPhone: hospital.contactPhone
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/hospital/login
// @desc    Login hospital
// @access  Public
router.post('/hospital/login', async (req, res) => {
  try {
    const { hospitalId, password } = req.body;

    // Check for hospital
    const hospital = await Hospital.findOne({ hospitalId }).select('+password');
    if (!hospital) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await hospital.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(hospital._id, 'hospital');

    res.json({
      token,
      hospital: {
        id: hospital._id,
        name: hospital.name,
        hospitalId: hospital.hospitalId,
        location: hospital.location,
        city: hospital.city,
        contactEmail: hospital.contactEmail,
        contactPhone: hospital.contactPhone,
        stats: hospital.stats
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/donor/signup
// @desc    Register a new donor (with password)
// @access  Public
router.post('/donor/signup', async (req, res) => {
  try {
    const { name, email, phone, bloodGroup, age, city, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !bloodGroup || !city || !password) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    // Check if donor exists
    const donorExists = await Donor.findOne({ email });
    if (donorExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create donor with password
    const donor = await Donor.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      bloodGroup,
      age: parseInt(age) || 18,
      city: city.trim(),
      password,  // Model will hash this
      verified: true,  // Auto-verify for password-based signup
      availability: true
    });

    const token = generateToken(donor._id, 'donor');

    // Send welcome SMS (async - don't await)
    sendEmail({
      email: donor.email,
      subject: 'Welcome to Vital Drop!',
      message: `Hi ${donor.name}, thank you for joining Vital Drop! You'll receive emergency alerts for ${donor.bloodGroup} blood in ${donor.city}.`
    }).catch(err => console.error('Email send error:', err));

    res.status(201).json({
      token,
      donor: {
        id: donor._id,
        name: donor.name,
        email: donor.email,
        phone: donor.phone,
        bloodGroup: donor.bloodGroup,
        bloodType: donor.bloodGroup, // Alias for frontend
        age: donor.age,
        city: donor.city,
        lastDonationDate: donor.lastDonationDate,
        reputation: donor.reputation,
        totalDonations: donor.totalDonations,
        availability: donor.availability
      }
    });
  } catch (error) {
    console.error('Donor signup error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/donor/verify-otp
// @desc    Verify donor OTP and complete registration
// @access  Public
router.post('/donor/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const donor = await Donor.findOne({ email }).select('+otp +otpExpiry');
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // Check OTP
    if (donor.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check expiry
    if (donor.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Verify donor
    donor.verified = true;
    donor.otp = undefined;
    donor.otpExpiry = undefined;
    await donor.save();

    const token = generateToken(donor._id, 'donor');

    res.json({
      token,
      donor: {
        id: donor._id,
        name: donor.name,
        email: donor.email,
        phone: donor.phone,
        bloodGroup: donor.bloodGroup,
        city: donor.city,
        lastDonationDate: donor.lastDonationDate,
        reputation: donor.reputation,
        totalDonations: donor.totalDonations
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/donor/login
// @desc    Login donor (with password)
// @access  Public
router.post('/donor/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    // Check for donor
    const donor = await Donor.findOne({ email }).select('+password');
    if (!donor) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await donor.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(donor._id, 'donor');

    res.json({
      token,
      donor: {
        id: donor._id,
        name: donor.name,
        email: donor.email,
        phone: donor.phone,
        bloodGroup: donor.bloodGroup,
        bloodType: donor.bloodGroup, // Alias for frontend
        age: donor.age,
        city: donor.city,
        lastDonationDate: donor.lastDonationDate,
        reputation: donor.reputation,
        totalDonations: donor.totalDonations,
        availability: donor.availability
      }
    });
  } catch (error) {
    console.error('Donor login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/bloodbank/signup
// @desc    Register a new blood bank (with password)
// @access  Public
router.post('/bloodbank/signup', async (req, res) => {
  try {
    const { name, bloodBankId, location, password, contactEmail, contactPhone } = req.body;

    // Validate required fields
    if (!name || !bloodBankId || !location || !password || !contactEmail || !contactPhone) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    // Check if blood bank exists
    const bankExists = await BloodBank.findOne({ bankId: bloodBankId });
    if (bankExists) {
      return res.status(400).json({ message: 'Bank ID already registered' });
    }

    // Extract city from location
    let city = '';
    if (location.includes(',')) {
      city = location.split(',').pop()?.trim() || '';
    }
    if (!city) {
      city = location.trim();
    }

    // Create blood bank
    const bloodBank = await BloodBank.create({
      name: name.trim(),
      bankId: bloodBankId.trim(),
      location: location.trim(),
      city,
      password,
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      verified: true // Auto-verify for password-based signup
    });

    const token = generateToken(bloodBank._id, 'bloodbank');

    res.status(201).json({
      token,
      bloodBank: {
        id: bloodBank._id,
        name: bloodBank.name,
        bankId: bloodBank.bankId,
        bloodBankId: bloodBank.bankId, // Alias for frontend
        location: bloodBank.location,
        city: bloodBank.city,
        contactEmail: bloodBank.contactEmail,
        contactPhone: bloodBank.contactPhone,
        verified: bloodBank.verified
      }
    });
  } catch (error) {
    console.error('Blood bank signup error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/bloodbank/verify-otp
// @desc    Verify blood bank OTP
// @access  Public
router.post('/bloodbank/verify-otp', async (req, res) => {
  try {
    const { bankId, otp } = req.body;

    const bloodBank = await BloodBank.findOne({ bankId }).select('+otp +otpExpiry');
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank not found' });
    }

    // Check OTP
    if (bloodBank.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check expiry
    if (bloodBank.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Verify blood bank
    bloodBank.verified = true;
    bloodBank.otp = undefined;
    bloodBank.otpExpiry = undefined;
    await bloodBank.save();

    const token = generateToken(bloodBank._id, 'bloodbank');

    res.json({
      token,
      bloodBank: {
        id: bloodBank._id,
        name: bloodBank.name,
        bankId: bloodBank.bankId,
        location: bloodBank.location,
        city: bloodBank.city,
        contactEmail: bloodBank.contactEmail,
        contactPhone: bloodBank.contactPhone,
        verified: bloodBank.verified,
        stats: bloodBank.stats
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/bloodbank/login
// @desc    Login blood bank
// @access  Public
router.post('/bloodbank/login', async (req, res) => {
  try {
    const { bloodBankId, password } = req.body;

    // Find by bankId field but accept bloodBankId parameter
    const bloodBank = await BloodBank.findOne({ bankId: bloodBankId }).select('+password');
    if (!bloodBank) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bloodBank.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(bloodBank._id, 'bloodbank');

    res.json({
      token,
      bloodBank: {
        id: bloodBank._id,
        name: bloodBank.name,
        bankId: bloodBank.bankId,
        bloodBankId: bloodBank.bankId, // Alias for frontend
        location: bloodBank.location,
        city: bloodBank.city,
        contactEmail: bloodBank.contactEmail,
        contactPhone: bloodBank.contactPhone,
        verified: bloodBank.verified,
        stats: bloodBank.stats
      }
    });
  } catch (error) {
    console.error('Blood bank login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/patient/signup
// @desc    Register a new patient (with password)
// @access  Public
router.post('/patient/signup', async (req, res) => {
  try {
    const { name, email, phone, age, bloodGroup, city, location, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !age || !bloodGroup || !city || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if patient exists
    const patientExists = await PatientUser.findOne({ email });
    if (patientExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create patient with password
    const patient = await PatientUser.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      age: parseInt(age),
      bloodGroup,
      city: city.trim(),
      location: location || city,
      password,
      verified: true // Auto-verify for password-based signup
    });

    const token = generateToken(patient._id, 'patient');

    res.status(201).json({
      token,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        age: patient.age,
        bloodGroup: patient.bloodGroup,
        bloodType: patient.bloodGroup, // Alias for frontend
        city: patient.city,
        location: patient.location,
        verified: patient.verified
      }
    });
  } catch (error) {
    console.error('Patient signup error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/patient/verify-otp
// @desc    Verify patient OTP and complete registration
// @access  Public
router.post('/patient/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const patient = await PatientUser.findOne({ email }).select('+otp +otpExpiry');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check OTP
    if (patient.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check expiry
    if (patient.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    // Verify patient
    patient.verified = true;
    patient.otp = undefined;
    patient.otpExpiry = undefined;
    await patient.save();

    const token = generateToken(patient._id, 'patient');

    res.json({
      token,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        age: patient.age,
        bloodGroup: patient.bloodGroup,
        city: patient.city,
        location: patient.location,
        verified: patient.verified
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/patient/login
// @desc    Login patient (with password)
// @access  Public
router.post('/patient/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const patient = await PatientUser.findOne({ email }).select('+password');
    if (!patient) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await patient.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(patient._id, 'patient');

    res.json({
      token,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        age: patient.age,
        bloodGroup: patient.bloodGroup,
        bloodType: patient.bloodGroup, // Alias for frontend
        city: patient.city,
        location: patient.location,
        verified: patient.verified
      }
    });
  } catch (error) {
    console.error('Patient login error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;