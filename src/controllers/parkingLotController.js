const ParkingLot = require('@models/parkingLots');
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
      let parkinglots = await ParkingLot.find({
        location: {
          $near: {
            $maxDistance: 1609.34 * 5,
            $geometry: payload.location,
          },
        },
      })
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
      return response.ok(res, parkinglots);
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
