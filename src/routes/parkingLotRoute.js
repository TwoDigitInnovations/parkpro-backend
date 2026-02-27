const express = require('express');
const router = express.Router();
const auth = require('@middlewares/authMiddleware');
const parkinglot = require('@controllers/parkingLotController');

router.post('/create-parkinglots', auth('landlord_admin','landlord'), parkinglot.create_parkinglots);
router.get('/getAllParkingLots', auth('landlord_admin','landlord'), parkinglot.getAllParkingLot);
router.post('/updateParkingLots/:id', auth('landlord_admin','landlord'), parkinglot.updateParkingLot);
router.delete('/deleteParkingLots/:id', auth('landlord_admin','landlord'), parkinglot.deleteParkingLotById);
router.get('/:id', auth('landlord_admin','landlord'), parkinglot.getParkingLotById);


module.exports = router;