import mongoose from 'mongoose';

const emergencySchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'creatorModel'
  },
  creatorModel: {
    type: String,
    required: true,
    enum: ['Hospital', 'BloodBank']
  },
  creatorName: {
    type: String,
    required: true
  },
  bloodType: {
    type: String,
    required: [true, 'Please add blood type'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  unitsNeeded: {
    type: Number,
    required: [true, 'Please add units needed'],
    min: 1
  },
  unitsPledged: {
    type: Number,
    default: 0
  },
  unitsReceived: {
    type: Number,
    default: 0
  },
  city: {
    type: String,
    required: true,
    index: true
  },
  location: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Fulfilled', 'Cancelled'],
    default: 'Active'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'High'
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 24*60*60*1000) // 24 hours from now
  },
  responses: [{
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor'
    },
    unitsPledged: Number,
    respondedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Pledged', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pledged'
    }
  }]
}, {
  timestamps: true
});

// Update status based on units
emergencySchema.pre('save', function(next) {
  if (this.unitsReceived >= this.unitsNeeded) {
    this.status = 'Fulfilled';
  }
  next();
});

export default mongoose.model('Emergency', emergencySchema);