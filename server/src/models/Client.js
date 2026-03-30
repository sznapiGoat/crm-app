const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone cannot exceed 20 characters'],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive', 'lead'],
        message: 'Status must be active, inactive, or lead',
      },
      default: 'lead',
    },
    notes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Client', clientSchema);
