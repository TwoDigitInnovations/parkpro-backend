const Report = require('@models/Report');
const response = require('../responses');
const User = require('@models/User');

module.exports = {
  totalReportsDashboard: async (req, res) => {
    try {
      const [totalReports, closedReports, activeStaff, activeTechnician] =
        await Promise.all([
          // 🔹 Total reports
          Report.countDocuments(),
          Report.countDocuments({
            status: {
              $in: [
                'Penalty issued',
                'Vehicle Missing',
                'Resolve',
                'Unresolve',
              ],
            },
          }),

          User.countDocuments({
            role: 'guard',
          }),

          User.countDocuments({
            role: 'tech',
          }),
        ]);

      return response.ok(res, {
        totalReports,
        closedReports,
        activeStaff,
        activeTechnician,
      });
    } catch (error) {
      console.error('Dashboard report count error:', error);
      return response.error(
        res,
        error.message || 'Failed to fetch report summary',
      );
    }
  },
  last7DaysReports: async (req, res) => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // includes today
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const last7DaysReports = await Report.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt',
              },
            },
            total: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      return response.ok(res, last7DaysReports);
    } catch (error) {
      console.error('Last 7 days reports error:', error);
      return response.error(res, error.message);
    }
  },

  getTopOfficer: async (req, res) => {
    try {
      const topOfficers = await Report.aggregate([
        {
          $match: {
            status: 'Resolve',
            resolvedBy: { $ne: null },
          },
        },

        {
          $group: {
            _id: '$resolvedBy',
            totalResolved: { $sum: 1 },
          },
        },
        {
          $sort: { totalResolved: -1 },
        },

        {
          $lookup: {
            from: 'users', // collection name
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            _id: 0,
            userId: '$user._id',
            name: '$user.name',
            email: '$user.email',
            role: '$user.role',
            totalResolved: 1,
          },
        },
      ]);

      return response.ok(res, topOfficers);
    } catch (error) {
      console.error('Top officer error:', error);
      return response.error(
        res,
        error.message || 'Failed to fetch top officers',
      );
    }
  },
};
