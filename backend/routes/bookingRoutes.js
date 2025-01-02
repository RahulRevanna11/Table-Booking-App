const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.route('/check-availability')
  .get(bookingController.checkAvailability);

router.route('/')
  .get(bookingController.getBookings)
  .post(bookingController.createBooking);
router.route('/slots')
  .get(bookingController.getSlotDate)
router.route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
