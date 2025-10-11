const express = require('express');
const router = express.Router();
const { createReport, getReport, updateVerifyandSuspendStatus } = require('@controllers/reportController');
const auth = require('@middlewares/authMiddleware');

router.post('/createReport', auth('admin'), createReport);
router.get('/getReport', auth('admin', 'org'), getReport);
router.post('/updateVerifyandSuspendStatus', auth('admin', 'org'), updateVerifyandSuspendStatus);

module.exports = router;