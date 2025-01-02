const Booking = require('../models/Booking');
const { AppError } = require('../middleware/errorHandler');
const asyncHandler = require('express-async-handler');

// Create new booking
exports.createBooking = asyncHandler(async (req, res) => {

  // Convert the date string to a Date object in your desired timezone
  const dateLocal = new Date(req.body.date);
  dateLocal.setMinutes(dateLocal.getMinutes() - dateLocal.getTimezoneOffset()); // Adjust to local timezone

  // Update req.body with the corrected date
  req.body.date = dateLocal;
  console.log(req.body);

  const booking = await Booking.create(req.body);
  res.status(201).json({
    status: 'success',
    data: booking,
  });
});

// Get all bookings
exports.getBookings = asyncHandler(async (req, res) => {
  const { date, status } = req.query;
  const filter = {};
  
  if (date) {
    filter.date = new Date(date);
  }
  if (status) {
    filter.status = status;
  }

  const bookings = await Booking.find(filter).sort({ date: 1, time: 1 });
  
  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: bookings
  });
});

// Get single booking
exports.getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: booking
  });
});

// Update booking
exports.updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: booking
  });
});

// Delete booking
exports.deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Check availability
exports.checkAvailability = asyncHandler(async (req, res) => {
  const { date, time } = req.query;
  
  if (!date || !time) {
    throw new AppError('Please provide date and time', 400);
  }

  const existingBooking = await Booking.findOne({
    date: new Date(date),
    time,
    status: { $ne: 'cancelled' }
  });

  res.status(200).json({
    status: 'success',
    data: {
      available: !existingBooking
    }
  });
});
exports.getSlotDate = asyncHandler(async (req, res) =>{
  try {
    const { date } = req.query; // Date in ISO format (YYYY-MM-DD)
    const bookings = await Booking.find({ date: new Date(date) });

    const totalTables = 10; // Replace with dynamic table count if needed
    const timeSlots = [
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
    ];

    const availability = timeSlots.map((slot) => {
      const bookedCount = bookings.filter((b) => b.time === slot).length;
      return {
        time: slot,
        available: bookedCount < totalTables,
      };
    });

    res.json(availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch slot availability" });
  }
});
