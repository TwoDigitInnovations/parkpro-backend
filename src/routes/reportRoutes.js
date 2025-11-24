const express = require('express');
const router = express.Router();
const { createReport, getReport, updateVerifyandSuspendStatus,getReportForGuard,getReportHistory,updatereportstatus } = require('@controllers/reportController');
const auth = require('@middlewares/authMiddleware');
const { upload } = require('@services/fileUpload');

router.post('/createReport', auth('user', 'admin', 'guard', 'org', 'tech'),upload.single('image'), createReport);
router.get('/getReport', auth('user', 'admin', 'guard', 'org', 'tech'), getReport);
router.post('/getReportForGuard', auth('user', 'admin', 'guard', 'org', 'tech'), getReportForGuard);
router.post('/updateVerifyandSuspendStatus', auth('user', 'admin', 'guard', 'org', 'tech'), updateVerifyandSuspendStatus);
router.post('/updatereportstatus', auth('user', 'admin', 'guard', 'org', 'tech'), updatereportstatus);
router.get('/getReportHistory', auth('user', 'admin', 'guard', 'org', 'tech'), getReportHistory);

module.exports = router;