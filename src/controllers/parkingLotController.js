const ParkingLot = require('@models/parkingLots');
const Booking = require('@models/bookings');
const response = require('../responses');

module.exports = {
  create_parkinglots: async (req, res) => {
    try {
      req.body.user = req.user.id;
      let parkinglots = new ParkingLot({ ...req.body, CreatedBy: req.user.id });
      await parkinglots.save();
      return response.ok(res, parkinglots);
    } catch (error) {
      return response.error(res, error);
    }
  },

  getAllParkingLot: async (req, res) => {
    try {
      let { page = 1, limit = 20 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);

      const totalUsers = await ParkingLot.countDocuments();
      const totalPages = Math.ceil(totalUsers / limit);
      let parkinglots = await ParkingLot.find({
        CreatedBy: req.user.id,
      }).populate('building');

      return response.ok(res, {
        data: parkinglots,
        pagination: {
          totalUsers,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
  getNeabyParkingLot: async (req, res) => {
    try {
  let { page = 1, limit = 20 } = req.query;
  const payload = req.body;

  const parkinglots = await ParkingLot.aggregate([
    {
      $geoNear: {
        near: payload?.location, // { type: "Point", coordinates: [lng, lat] }
        distanceField: "distance",
        maxDistance: 1609.34 * 5, // 5 miles
        spherical: true,
      },
    },
    {
      $lookup: {
        from: "buildings", // collection name
        localField: "building",
        foreignField: "_id",
        as: "building"
      }
    },
    {
      $unwind: {
        path: "$building",
        preserveNullAndEmptyArrays: true
      }
    },
    {
    $addFields: {
      distanceInKm: { $divide: ["$distance", 1000] }
    }
   },
    {
      $sort: { createdAt: -1 },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: parseInt(limit),
    },
  ]);

  return response.ok(res, parkinglots);
} catch (error) {
  return response.error(res, error);
}
  },

  getParkingLotSlots: async (req, res) => {
  try {
    const { parking_lot_id } = req.params;
    // const { start_time, end_time } = req.body;
    const date = new Date();

    const lot = await ParkingLot.findById(parking_lot_id).lean();
    if (!lot) return response.error(res, 'Parking lot not found');

    // Get all overlapping bookings with row + column info
    const overlappingBookings = await Booking.find({
      parking_lot: parking_lot_id,
      status: { $in: ['Upcoming', 'Active'] },
      payment_status: { $in: ['Pending', 'Paid'] },
      start_time: { $lt: date },
      end_time:   { $gt: date },
    }).select('slot_id selected_row selected_column').lean();

    // Build a Set of "slotId_row_col" keys for exact cell matching
    const rentedCells = new Set(
      overlappingBookings.map(
        (b) => `${b.slot_id}_${b.selected_row}_${b.selected_column}`
      )
    );

    // Mark slots and inject rentedCells so frontend knows which cells are taken
    const slotsWithStatus = lot.slots.map((slot) => ({
      ...slot,
      rentedCells: overlappingBookings
        .filter((b) => b.slot_id.toString() === slot._id.toString())
        .map((b) => ({ row: b.selected_row, column: b.selected_column })),
    }));

    return response.ok(res, {
      ...lot,
      slots: slotsWithStatus,
    });

  } catch (error) {
    return response.error(res, error);
  }
},

  getParkingLotById: async (req, res) => {
    try {
      let parkinglots = await ParkingLot.findById(req.params.id);
      return response.ok(res, parkinglots);
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateParkingLot: async (req, res) => {
    try {
      let parkinglots = await ParkingLot.findByIdAndUpdate(
        req.params.id,
        req.body,
      );
      return response.ok(res, parkinglots);
    } catch (error) {
      return response.error(res, error);
    }
  },

  deleteParkingLotById: async (req, res) => {
    try {
      await ParkingLot.findByIdAndDelete(req.params.id);
      return response.ok(res, { message: 'Deleted successfully' });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
