const express = require('express');
const router = express.Router();
const { createReport, getReport, updateVerifyandSuspendStatus } = require('@controllers/reportController');
const auth = require('@middlewares/authMiddleware');
const { upload } = require('@services/fileUpload');

router.post('/createReport', auth('user', 'admin', 'guard', 'org', 'tech'),upload.single('image'), createReport);
router.get('/getReport', auth('user', 'admin', 'guard', 'org', 'tech'), getReport);
router.post('/updateVerifyandSuspendStatus', auth('admin', 'org'), updateVerifyandSuspendStatus);

module.exports = router;