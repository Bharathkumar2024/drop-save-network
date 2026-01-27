import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const patientUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add your email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please add your phone number'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Please add your age'],
    min: 1,
    max: 120
  },
  bloodGroup: {
    type: String,
    required: [true, 'Please add your blood group'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  city: {
    type: String,
    required: [true, 'Please add your city'],
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  otp: {
    type: String,
    select: false
  },
  otpExpiry: {
    type: Date,
    select: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  // Track blood requests made by this patient
  bloodRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodRequest'
  }],
  // Emergency contact
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  }
}, {
  timestamps: true
});

// Hash password before saving
patientUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
patientUserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('PatientUser', patientUserSchema);