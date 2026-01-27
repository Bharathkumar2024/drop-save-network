import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const bloodBankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a blood bank name'],
    trim: true
  },
  bankId: {
    type: String,
    required: [true, 'Please add a bank ID'],
    unique: true,
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  city: {
    type: String,
    required: true,
    index: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  contactEmail: {
    type: String,
    required: [true, 'Please add an email'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  contactPhone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  certificates: [{
    filename: String,
    path: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  verified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
    select: false
  },
  otpExpiry: {
    type: Date,
    select: false
  },
  stats: {
    totalStock: { type: Number, default: 0 },
    totalDispatched: { type: Number, default: 0 },
    successfulSends: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Hash password before saving
bloodBankSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
bloodBankSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('BloodBank', bloodBankSchema);