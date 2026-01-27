import mongoose from 'mongoose';

const sendRecordSchema = new mongoose.Schema({
  bloodBank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodBank',
    required: true,
    index: true
  },
  preservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Preservation',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'recipientModel'
  },
  recipientModel: {
    type: String,
    required: true,
    enum: ['Hospital', 'BloodBank']
  },
  recipientName: {
    type: String,
    required: true
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  units: {
    type: Number,
    required: true,
    min: 1
  },
  dispatchDate: {
    type: Date,
    default: Date.now
  },
  expectedDelivery: {
    type: Date,
    required: true
  },
  actualDelivery: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Pending', 'In Transit', 'Delivered', 'Failed'],
    default: 'Pending'
  },
  trackingNumber: {
    type: String,
    unique: true
  },
  notes: {
    type: String,
    default: ''
  },
  emergency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Emergency'
  }
}, {
  timestamps: true
});

// Generate tracking number before saving
sendRecordSchema.pre('save', function(next) {
  if (!this.trackingNumber) {
    this.trackingNumber = 'TRK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

export default mongoose.model('SendRecord', sendRecordSchema);