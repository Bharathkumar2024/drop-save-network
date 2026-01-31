import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  bloodGroup: {
    type: String,
    required: [true, 'Please add a blood group'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  age: {
    type: Number,
    default: 18
  },
  city: {
    type: String,
    required: [true, 'Please add a city'],
    index: true
  },
  lastDonationDate: {
    type: Date,
    default: null
  },
  password: {
    type: String,
    select: false  // Don't return password by default
  },
  verified: {
    type: Boolean,
    default: false
  },
  availability: {
    type: Boolean,
    default: true
  },
  otp: {
    type: String,
    select: false
  },
  otpExpiry: {
    type: Date,
    select: false
  },
  reputation: {
    type: Number,
    default: 0
  },
  totalDonations: {
    type: Number,
    default: 0
  },
  totalPledges: {
    type: Number,
    default: 0
  },
  donationHistory: [{
    donationDate: {
      type: Date,
      required: true
    },
    location: String,
    hospitalName: String,
    bloodType: String,
    unitsdonated: {
      type: Number,
      default: 1
    },
    certificateNumber: String,
    certificatePath: String,
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Encrypt password before saving
donorSchema.pre('save', async function (next) {
  // Only hash password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
donorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('Donor', donorSchema);