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

router.post('/create-building', auth('user'),upload.single('image'), create_building);
router.get('/getAllBuilding', auth('user'), getAllBuilding);
router.post('/updateBuilding/:id', auth('user'), updateBuilding);
router.delete('/deleteBuilding/:id', auth('user'), deleteBuildingById);
router.get('/:id', auth('user'), getBuildingById);


module.exports = router;