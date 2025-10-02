const authRoutes = require("@routes/authRoutes");
const reportRoutes = require("@routes/reportRoutes");

module.exports = (app) => {
  app.use('/auth', authRoutes);
  app.use('/report', reportRoutes);
};
