import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a hospital name'],
    trim: true
  },
  hospitalId: {
    type: String,
    required: [true, 'Please add a hospital ID'],
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
  verified: {
    type: Boolean,
    default: true
  },
  stats: {
    totalPatients: { type: Number, default: 0 },
    patientsReceived: { type: Number, default: 0 },
    emergenciesCreated: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Hash password before saving
hospitalSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
hospitalSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('Hospital', hospitalSchema);