const authRoutes = require('@routes/authRoutes');
const reportRoutes = require('@routes/reportRoutes');
const notificationRoutes = require('@routes/notificationRoutes');
const addressRoutes = require('@routes/addressRoute');
const vehicleRoute = require('@routes/vehicleRoute');
const rentSpotRoute = require('@routes/rentSpotRoute');
const parkingRoute = require('@routes/parkingRoutes');
const contentRoute = require('@routes/contentRoute');
const adminRoutes = require('@routes/adminRoutes');

module.exports = (app) => {
  app.use('/auth', authRoutes);
  app.use('/report', reportRoutes);
  app.use('/notification', notificationRoutes);
  app.use('/address', addressRoutes);
  app.use('/vehicle', vehicleRoute);
  app.use('/rentspot', rentSpotRoute);
  app.use('/parking', parkingRoute);
  app.use('/content', contentRoute);
  app.use('/admin',adminRoutes);
};
