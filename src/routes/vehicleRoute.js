const express = require('express');
const router = express.Router();
const auth = require('@middlewares/authMiddleware');
const { create_vehicle, getVehicleByUserId, updateVehicle, deleteVehicleById, getVehicleById } = require('@controllers/vehicleController');


router.post('/create-vehicle', auth('user'), create_vehicle);
router.get('/getVehicleByUserId', auth('user'), getVehicleByUserId);
router.post('/update/:id', auth('user'), updateVehicle);
router.delete('/delete/:id', auth('user'), deleteVehicleById);
router.get('/:id', auth('user'), getVehicleById);


module.exports = router;