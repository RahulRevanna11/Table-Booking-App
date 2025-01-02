const Table = require('../models/Table');
const Booking = require('../models/Booking');
const { AppError } = require('../middleware/errorHandler');
const asyncHandler = require('express-async-handler');

// Get all tables
exports.getTables = asyncHandler(async (req, res) => {
  console.log("inside tables");
  
  const tables = await Table.find({ isActive: true });
  res.status(200).json({
    status: 'success',
    data: tables
  });
});

// Get table availability for date/time
exports.getTableAvailability = asyncHandler(async (req, res) => {
  let { date, time } = req.query;
  console.log(date)
  console.log(time)

  if (!date || !time) {
    throw new AppError('Please provide date and time', 400);
  }
 
  // Get all active tables
  const tables = await Table.find({ isActive: true });
  const inputDate = new Date(date)
  const startDate = new Date(inputDate.setHours(0, 0, 0, 0)); 
  const endDate = new Date(inputDate.setHours(23, 59, 59, 999));
  // const bookings = await Booking.find({
  //   date: new Date(date),
  //   time,
  //   // status: { $ne: 'cancelled' }
  // }).select('table');
  const bookings = await Booking.find({
    date: {
      $gte: startDate,
      $lt: endDate
    },
    time,
    // status: { $ne: 'cancelled' }
  }).select('table');
  console.log(bookings);
  
  // Create availability map
  const bookedTableIds = bookings.map(booking => booking.table.toString());
  // console.log(bookedTableIds);
  
  const availability = tables.map(table => ({
    ...table.toObject(),
    isAvailable: !bookedTableIds.includes(table._id.toString())
  }));
// console.log(availability);

  res.status(200).json({
    status: 'success',
    data: availability
  });
});