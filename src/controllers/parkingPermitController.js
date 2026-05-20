const ParkingPermit = require('@models/ParkingPermit');
const response = require('../responses');

module.exports = {
  createPermit: async (req, res) => {
    try {
      const permit = new ParkingPermit({
        ...req.body,
        organization: req.user._id,
      });
      await permit.save();
      const populated = await permit.populate([
        { path: 'userId', select: '-password' },
        { path: 'parkingLot' },
      ]);
      return response.ok(res, populated);
    } catch (error) {
      return response.error(res, error);
    }
  },

  getAllPermits: async (req, res) => {
    try {
      let cond = { organization: req.user._id };

      if (req.query.status) cond.status = req.query.status;
      if (req.query.permitType) cond.permitType = req.query.permitType;

      if (req.query.key) {
        cond['$or'] = [
          { fullName: { $regex: req.query.key, $options: 'i' } },
          { licensePlate: { $regex: req.query.key, $options: 'i' } },
        ];
      }

      if (req.query.email) {
        cond.email = { $regex: req.query.email, $options: 'i' };
      }

      if (req.query.date) {
        const startDate = new Date(req.query.date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        cond.createdAt = { $gte: startDate, $lte: endDate };
      }

      const permits = await ParkingPermit.find(cond)
        .sort({ createdAt: -1 })
        .populate('userId', '-password')
        .populate('parkingLot');

      return response.ok(res, { data: permits });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getSinglePermit: async (req, res) => {
    try {
      const permit = await ParkingPermit.findOne({
        _id: req.params.id,
        organization: req.user._id,
      })
        .populate('userId', '-password')
        .populate('parkingLot');

      if (!permit) return response.notFound(res, 'Permit not found');
      return response.ok(res, permit);
    } catch (error) {
      return response.error(res, error);
    }
  },

  updatePermit: async (req, res) => {
    try {
      const permit = await ParkingPermit.findOneAndUpdate(
        { _id: req.params.id, organization: req.user._id },
        req.body,
        { new: true },
      )
        .populate('userId', '-password')
        .populate('parkingLot');

      if (!permit) return response.notFound(res, 'Permit not found');
      return response.ok(res, permit);
    } catch (error) {
      return response.error(res, error);
    }
  },

  deletePermit: async (req, res) => {
    try {
      const permit = await ParkingPermit.findOneAndDelete({
        _id: req.params.id,
        organization: req.user._id,
      });

      if (!permit) return response.notFound(res, 'Permit not found');
      return response.ok(res, 'Permit deleted successfully');
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateStatus: async (req, res) => {
    try {
      const permit = await ParkingPermit.findOneAndUpdate(
        { _id: req.params.id, organization: req.user._id },
        { status: req.body.status },
        { new: true },
      );

      if (!permit) return response.notFound(res, 'Permit not found');
      return response.ok(res, permit);
    } catch (error) {
      return response.error(res, error);
    }
  },
};
