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
// @desc    Register a new donor (with OTP)
// @access  Public
router.post('/donor/signup', async (req, res) => {
  try {
    const { name, email, phone, bloodGroup, lastDonationDate, city } = req.body;

    // Check if donor exists
    const donorExists = await Donor.findOne({ email });
    if (donorExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create donor
    const donor = await Donor.create({
      name,
      email,
      phone,
      bloodGroup,
      lastDonationDate: lastDonationDate || null,
      city,
      otp,
      otpExpiry,
      verified: false
    });

    // Send OTP via email (simulated)
    await sendEmail({
      email: donor.email,
      subject: 'Vital Drop - Verify Your Account',
      message: `Your OTP is: ${otp}. Valid for 10 minutes.`
    });

    res.status(201).json({
      message: 'OTP sent to your email',
      email: donor.email,
      // For prototype, return OTP in response (remove in production)
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
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
// @desc    Login donor (send OTP)
// @access  Public
router.post('/donor/login', async (req, res) => {
  try {
    const { email } = req.body;

    const donor = await Donor.findOne({ email });
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found. Please sign up first.' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    donor.otp = otp;
    donor.otpExpiry = otpExpiry;
    await donor.save();

    // Send OTP
    await sendEmail({
      email: donor.email,
      subject: 'Vital Drop - Login OTP',
      message: `Your login OTP is: ${otp}. Valid for 10 minutes.`
    });

    res.json({
      message: 'OTP sent to your email',
      email: donor.email,
      // For prototype
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/bloodbank/signup
// @desc    Register a new blood bank (with certificate upload)
// @access  Public
router.post('/bloodbank/signup', upload.array('certificates', 5), async (req, res) => {
  try {
    const { name, bankId, location, password, contactEmail, contactPhone } = req.body;

    // Check if blood bank exists
    const bankExists = await BloodBank.findOne({ bankId });
    if (bankExists) {
      return res.status(400).json({ message: 'Bank ID already registered' });
    }

    // Extract city
    const city = location.split(',').pop().trim();

    // Process uploaded certificates
    const certificates = req.files ? req.files.map(file => ({
      filename: file.filename,
      path: file.path
    })) : [];

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Create blood bank
    const bloodBank = await BloodBank.create({
      name,
      bankId,
      location,
      city,
      password,
      contactEmail,
      contactPhone,
      certificates,
      otp,
      otpExpiry,
      verified: false
    });

    // Send OTP
    await sendEmail({
      email: bloodBank.contactEmail,
      subject: 'Vital Drop - Verify Your Blood Bank',
      message: `Your OTP is: ${otp}. Valid for 10 minutes.`
    });

    res.status(201).json({
      message: 'Blood bank registered. OTP sent to your email.',
      bankId: bloodBank.bankId,
      // For prototype
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
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
    const { bankId, password } = req.body;

    const bloodBank = await BloodBank.findOne({ bankId }).select('+password');
    if (!bloodBank) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bloodBank.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!bloodBank.verified) {
      return res.status(403).json({ message: 'Blood bank not verified. Please verify your account.' });
    }

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

// @route   POST /api/auth/patient/signup
// @desc    Register a new patient
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

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create patient
    const patient = await PatientUser.create({
      name,
      email,
      phone,
      age,
      bloodGroup,
      city,
      location: location || city,
      password,
      otp,
      otpExpiry,
      verified: false
    });

    // Send OTP via email
    await sendEmail({
      email: patient.email,
      subject: 'Vital Drop - Verify Your Patient Account',
      message: `Welcome to Vital Drop! Your OTP is: ${otp}. Valid for 10 minutes.`
    });

    res.status(201).json({
      message: 'Patient registered successfully. OTP sent to your email.',
      email: patient.email,
      // For development
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
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
// @desc    Login patient (send OTP)
// @access  Public
router.post('/patient/login', async (req, res) => {
  try {
    const { email } = req.body;

    const patient = await PatientUser.findOne({ email });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found. Please sign up first.' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    patient.otp = otp;
    patient.otpExpiry = otpExpiry;
    await patient.save();

    // Send OTP
    await sendEmail({
      email: patient.email,
      subject: 'Vital Drop - Login OTP',
      message: `Your login OTP is: ${otp}. Valid for 10 minutes.`
    });

    res.json({
      message: 'OTP sent to your email',
      email: patient.email,
      // For development
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;