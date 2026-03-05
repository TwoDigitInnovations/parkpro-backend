const express = require('express');
const router = express.Router();
const auth = require('@middlewares/authMiddleware');
const {
  create_building,
  getAllBuilding,
  deleteBuildingById,
  getBuildingById,
  updateBuilding,
} = require('@controllers/buildingController');
const { upload } = require('@services/fileUpload');

router.post(
  '/create-building',
  auth('user', 'landlord_admin'),
  upload.single('image'),
  create_building,
);
router.get('/getAllBuilding', auth('user', 'landlord_admin'), getAllBuilding);
router.post(
  '/updateBuilding/:id',
  auth('user', 'landlord_admin'),
  updateBuilding,
);
router.delete(
  '/deleteBuilding/:id',
  auth('user', 'landlord_admin'),
  deleteBuildingById,
);
router.get('/:id', auth('user'), getBuildingById);

module.exports = router;
