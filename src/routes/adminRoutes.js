const express = require('express');
const router = express.Router();
const auth = require('@middlewares/authMiddleware');

const {
  totalReportsDashboard,
  last7DaysReports,
  getTopOfficer
} = require('@controllers/adminController');

router.get('/dashboardDetails', totalReportsDashboard);
router.get('/last7DaysReports', last7DaysReports);
router.get('/getTopOfficer',getTopOfficer)
module.exports = router;
