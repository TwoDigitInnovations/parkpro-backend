const Kiosk = require('@models/Kiosk');
const response = require('../responses');

module.exports = {
  createKiosk: async (req, res) => {
    try {
      const { latitude, longitude, ...rest } = req.body;

      const kiosk = new Kiosk({
        ...rest,
        organization: req.user._id || req.user.id,
        location: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
      });

      if (req.file && req.file.location) {
        kiosk.photo = req.file.location;
      }

      await kiosk.save();
      return response.ok(res, kiosk);
    } catch (error) {
      return response.error(res, error);
    }
  },

  getAllKiosks: async (req, res) => {
    try {
      let cond = {
        organization: req.query.organization || req.user._id,
      };

      if (req.query.deploymentStatus) cond.deploymentStatus = req.query.deploymentStatus;
      if (req.query.zoneAssignment) cond.zoneAssignment = req.query.zoneAssignment;

      if (req.query.key) {
        cond['$or'] = [
          { kioskName: { $regex: req.query.key, $options: 'i' } },
          { modelNumber: { $regex: req.query.key, $options: 'i' } },
          { streetAddress: { $regex: req.query.key, $options: 'i' } },
        ];
      }

      if (req.query.date) {
        const startDate = new Date(req.query.date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        cond.createdAt = { $gte: startDate, $lte: endDate };
      }

      const kiosks = await Kiosk.find(cond)
        .sort({ createdAt: -1 })
        .populate('organization', '-password');

      return response.ok(res, { data: kiosks });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getSingleKiosk: async (req, res) => {
    try {
      const kiosk = await Kiosk.findOne({
        _id: req.params.id,
        organization: req.user._id,
      }).populate('organization', '-password');

      if (!kiosk) return response.notFound(res, 'Kiosk not found');
      return response.ok(res, kiosk);
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateKiosk: async (req, res) => {
    try {
      const { latitude, longitude, ...rest } = req.body;

      if (latitude && longitude) {
        rest.location = {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        };
      }

      if (req.file && req.file.location) {
        rest.photo = req.file.location;
      }

      const kiosk = await Kiosk.findOneAndUpdate(
        { _id: req.params.id, organization: req.user._id },
        rest,
        { new: true },
      );

      if (!kiosk) return response.notFound(res, 'Kiosk not found');
      return response.ok(res, kiosk);
    } catch (error) {
      return response.error(res, error);
    }
  },

  deleteKiosk: async (req, res) => {
    try {
      const kiosk = await Kiosk.findOneAndDelete({
        _id: req.params.id,
        organization: req.user._id,
      });

      if (!kiosk) return response.notFound(res, 'Kiosk not found');
      return response.ok(res, 'Kiosk deleted successfully');
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateStatus: async (req, res) => {
    try {
      const kiosk = await Kiosk.findOneAndUpdate(
        { _id: req.params.id, organization: req.user._id },
        { deploymentStatus: req.body.deploymentStatus },
        { new: true },
      );

      if (!kiosk) return response.notFound(res, 'Kiosk not found');
      return response.ok(res, kiosk);
    } catch (error) {
      return response.error(res, error);
    }
  },
};
