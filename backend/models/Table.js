const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  shape: {
    type: String,
    enum: ['round', 'square', 'rectangle'],
    required: true
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Table', tableSchema);