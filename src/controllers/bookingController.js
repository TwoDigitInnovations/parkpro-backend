
const Booking = require("@models/bookings");
const ParkingLot = require("@models/parkingLots");
const response = require("../responses");

module.exports = {
    createBooking: async (req, res) => {
  try {
    const user_id = req.user.id;
    const {
      parking_lot,
      slot_id,
      slot_label,
      selected_row,      // which row user tapped
      selected_column,   // which column user tapped
      start_time,
      end_time,
      rental_type,
      license_plate,
      total_price
    } = req.body;

    // Check conflict for this exact slot + row + column + time range
    const conflict = await Booking.findOne({
      slot_id,
      selected_row,
      selected_column,
      status: { $in: ['Upcoming', 'Active'] },
      payment_status: { $in: ['Pending', 'Paid'] },
      start_time: { $lt: new Date(end_time) },
      end_time:   { $gt: new Date(start_time) },
    });
console.log('Conflict check:', { conflict });
    if (conflict) {
      return response.error(res, 'This cell is already booked for the selected time');
    }

    // Calculate price
    const lot = await ParkingLot.findById(parking_lot).lean();
    if (!lot) return response.error(res, 'Parking lot not found');


    const booking = await Booking.create({
      booked_by:       user_id,
      parking_lot,
      slot_id,
      slot_label,
      selected_row,      // saved
      selected_column,   // saved
      start_time,
      end_time,
      rental_type,
      license_plate,
      total_price,
      currency:        'SEK',
      payment_status:  'Pending',
      status:          'Upcoming',
    });

    return response.ok(res, booking);
  } catch (error) {
    return response.error(res, error);
  }
},
getUserBookings: async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      let bookings = await Booking.find({ booked_by: req.user.id })
      .populate({
        path: 'parking_lot',
        populate: {
          path: 'building',
        },
      })
        .sort({createdAt: -1,})
        .limit(limit * 1)
        .skip((page - 1) * limit);
      return response.ok(res, bookings);
    } catch (error) {
      return response.error(res, error);
    }
  },
}