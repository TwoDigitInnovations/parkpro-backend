const express = require('express');
const router = express.Router();
const Booking = require('@controllers/bookingController');
const auth = require('@middlewares/authMiddleware');

router.post('/createBooking',auth('user','landlord_admin','landlord'), Booking.createBooking);
router.get('/getUserBookings',auth('user','landlord_admin','landlord'), Booking.getUserBookings);

module.exports = router;
