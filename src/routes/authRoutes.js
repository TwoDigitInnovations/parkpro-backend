const express = require('express');
const router = express.Router();
const {
  login,
  register,
  sendOTP,
  verifyOTP,
  changePassword,
  myProfile,
  getAllUser,
  updateprofile,
  create_org,
  create_landlord,
  updateStatus,
  create_user,
} = require('@controllers/authController');
const auth = require('@middlewares/authMiddleware');
const { upload } = require('@services/fileUpload');

router.post('/login', login);
router.post('/register', register);
router.post('/create_org', auth('superadmin'), create_org);
router.post('/create_user', auth('landlord'), create_user);
router.post('/create_landlord', auth('landlord_admin'), create_landlord);
router.post('/updateStatus', auth('landlord_admin'), updateStatus);
router.post('/sendOTP', sendOTP);
router.post('/verifyOTP', verifyOTP);
router.post('/changePassword', changePassword);
router.get(
  '/profile',
  auth('admin', 'user', 'guard', 'org', 'tech', 'landlord_admin', 'landlord'),
  myProfile,
);
router.post(
  '/updateprofile',
  auth('admin', 'user', 'guard', 'org', 'tech', 'landlord_admin', 'landlord'),
  upload.single('image'),
  updateprofile,
);
router.get(
  '/getAllUser',
  auth('admin', 'org', 'superadmin', 'landlord_admin', 'landlord'),
  getAllUser,
);
// router.get('/getAllGuard', auth('admin', 'org'), getAllGuard);
// router.get('/getAllTechnician', auth('admin', 'org'), getAllTechnician);
// router.get('/getAllOrganization', auth('superadmin'), getAllOrganization);

router.get('/admin-only', auth('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin user!' });
});

router.get('/admin-seller', auth('admin', 'seller'), (req, res) => {
  res.json({ message: 'Welcome, admin or seller!' });
});

router.get('/protected', auth(), (req, res) => {
  res.json({ message: 'Welcome, authenticated user!', user: req.user });
});

module.exports = router;
