const express = require('express');
const router = express.Router();
const auth = require('@middlewares/authMiddleware');
const {
    create_building,
    getAllBuilding,
    deleteBuildingById,
    getBuildingById,
    updateBuilding
} = require('@controllers/buildingController');
const { upload } = require('@services/fileUpload');

router.post('/create-building', auth('landlord_admin','landlord'),upload.single('image'), create_building);
router.get('/getAllBuilding', auth('landlord_admin','landlord'), getAllBuilding);
router.post('/updateBuilding/:id', auth('landlord_admin','landlord'),upload.single('image'), updateBuilding);
router.delete('/deleteBuilding/:id', auth('landlord_admin','landlord'), deleteBuildingById);
router.get('/:id', auth('landlord_admin','landlord'), getBuildingById);


module.exports = router;