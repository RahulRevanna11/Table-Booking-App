const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  guests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: [1, 'Minimum 1 guest required'],
    max: [8, 'Maximum 8 guests allowed']
  },
  date: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  time: {
    type: String,
    required: [true, 'Booking time is required'],
    enum: ['12:00', '12:30', '13:00', '13:30', '14:00', '18:00', '18:30', '19:00', '19:30', '20:00']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    trim: true,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },
},

   {
  timestamps: true
});

// Compound index to prevent double bookings
bookingSchema.index({ date: 1, time: 1 ,table:1}, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);