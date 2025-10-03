const authRoutes = require("@routes/authRoutes");
const reportRoutes = require("@routes/reportRoutes");
const notificationRoutes = require("@routes/notificationRoutes");

module.exports = (app) => {
  app.use('/auth', authRoutes);
  app.use('/report', reportRoutes);
  app.use('/notification', notificationRoutes);
};
