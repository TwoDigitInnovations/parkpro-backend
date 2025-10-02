const express = require('express');
const router = express.Router();
const { createReport, getReport, updateVerifyandSuspendStatus } = require('@controllers/reportController');
const auth = require('@middlewares/authMiddleware');

router.post('/createReport', auth('admin'), createReport);
router.get('/getReport', auth('admin'), getReport);
router.post('/updateVerifyandSuspendStatus', auth('admin'), updateVerifyandSuspendStatus);

module.exports = router;