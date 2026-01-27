import mongoose from 'mongoose';

const preservationSchema = new mongoose.Schema({
  bloodBank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodBank',
    required: true,
    index: true
  },
  batchId: {
    type: String,
    required: true,
    unique: true
  },
  bloodType: {
    type: String,
    required: [true, 'Please add blood type'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  units: {
    type: Number,
    required: [true, 'Please add units'],
    min: 1
  },
  collectionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Reserved', 'Dispatched', 'Expired'],
    default: 'Available'
  },
  storageLocation: {
    type: String,
    default: ''
  },
  donorInfo: {
    name: String,
    donorId: String
  }
}, {
  timestamps: true
});

// Check if near expiry (within 7 days)
preservationSchema.virtual('isNearExpiry').get(function() {
  const daysUntilExpiry = Math.ceil((this.expiryDate - new Date()) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
});

// Check if expired
preservationSchema.virtual('isExpired').get(function() {
  return this.expiryDate < new Date();
});

preservationSchema.set('toJSON', { virtuals: true });
preservationSchema.set('toObject', { virtuals: true });

export default mongoose.model('Preservation', preservationSchema);