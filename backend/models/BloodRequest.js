import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PatientUser',
    required: true,
    index: true
  },
  patientName: {
    type: String,
    required: [true, 'Please add patient name'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Please add patient age']
  },
  bloodGroup: {
    type: String,
    required: [true, 'Please add blood group'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  unitsNeeded: {
    type: Number,
    required: [true, 'Please add units needed'],
    min: 1
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Please add city'],
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  urgencyLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Fulfilled', 'Cancelled'],
    default: 'Pending'
  },
  description: {
    type: String,
    trim: true
  },
  // Blood bank that accepted the request
  acceptedBy: {
    bloodBank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodBank'
    },
    bloodBankName: String,
    acceptedAt: Date
  },
  // Track responses from blood banks
  responses: [{
    bloodBank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodBank'
    },
    bloodBankName: String,
    status: {
      type: String,
      enum: ['Interested', 'Accepted', 'Declined']
    },
    message: String,
    respondedAt: {
      type: Date,
      default: Date.now
    }
  }],
  fulfilledAt: Date,
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

// Index for efficient queries
bloodRequestSchema.index({ city: 1, status: 1, createdAt: -1 });
bloodRequestSchema.index({ patient: 1, createdAt: -1 });

export default mongoose.model('BloodRequest', bloodRequestSchema);