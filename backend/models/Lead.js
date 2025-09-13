const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lead title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Won', 'Lost'],
    default: 'New'
  },
  value: {
    type: Number,
    min: [0, 'Value cannot be negative'],
    default: 0
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
leadSchema.index({ customerId: 1 });
leadSchema.index({ ownerId: 1 });
leadSchema.index({ status: 1 });

module.exports = mongoose.model('Lead', leadSchema);