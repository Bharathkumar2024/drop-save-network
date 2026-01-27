import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Please add patient name'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Please add patient age']
  },
  room: {
    type: String,
    required: [true, 'Please add room number']
  },
  caseDescription: {
    type: String,
    required: [true, 'Please add case description']
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
  unitsReceived: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Requesting', 'Partial', 'Received'],
    default: 'Requesting'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  admissionDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update status based on units
patientSchema.pre('save', function(next) {
  if (this.unitsReceived >= this.unitsNeeded) {
    this.status = 'Received';
  } else if (this.unitsReceived > 0) {
    this.status = 'Partial';
  } else {
    this.status = 'Requesting';
  }
  next();
});

export default mongoose.model('Patient', patientSchema);