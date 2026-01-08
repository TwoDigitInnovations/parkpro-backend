const Notification = require('@models/notification');
const response = require("../responses");
const { default: mongoose } = require('mongoose');

module.exports = {

    getNotification: async (req, res) => {
        try {
            const notifications = await Notification.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "for",
      foreignField: "_id",
      as: "users"
    }
  },
  {
    $match: {
      "users.organization": new mongoose.Types.ObjectId(req.user.id)
    }
  },
  {
    $sort: { createdAt: -1 }
  }
]);
            return response.ok(res, notifications);
        } catch (error) {
            return response.error(res, error);
        }
    },
    getnotificationforapp: async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const ids = req.user.id;
      console.log("Fetching notifications for user:", ids);
      const data = await Notification.find({ for: { $in: ids } }).sort({
        createdAt: -1,
      }).limit(limit * 1)
        .skip((page - 1) * limit);
      return response.ok(res, data);
    } catch (err) {
      console.log(err);
      return response.error(res, err);
    }
  },
}