const express = require('express');
const router = express.Router();
const {
  createReport,
  getReport,
  updateVerifyandSuspendStatus,
  getReportForGuard,
  getReportHistory,
  updatereportstatus,
  getReportforuser,
} = require('@controllers/reportController');
const auth = require('@middlewares/authMiddleware');
const { upload } = require('@services/fileUpload');

router.post(
  '/createReport',
  auth('user', 'admin', 'guard', 'org', 'tech', 'superadmin'),
  upload.single('image'),
  createReport,
);
router.get(
  '/getReport',
  auth('user', 'admin', 'guard', 'org', 'tech', 'superadmin'),
  getReport,
);
router.get(
  '/getReportforuser',
  auth('user', 'admin', 'guard', 'org', 'tech', 'superadmin'),
  getReportforuser,
);
router.post(
  '/getReportForGuard',
  auth('user', 'admin', 'guard', 'org', 'tech', 'superadmin'),
  getReportForGuard,
);
router.post(
  '/updateVerifyandSuspendStatus',
  auth('user', 'admin', 'guard', 'org', 'tech', 'superadmin'),
  updateVerifyandSuspendStatus,
);
router.post(
  '/updatereportstatus',
  auth('user', 'admin', 'guard', 'org', 'tech', 'superadmin'),
  updatereportstatus,
);
router.get(
  '/getReportHistory',
  auth('user', 'admin', 'guard', 'org', 'tech', 'superadmin'),
  getReportHistory,
);

module.exports = router;
