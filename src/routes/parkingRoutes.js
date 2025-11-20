const express = require('express');
const router = express.Router();
const Parking = require('@controllers/parkingController');
const auth = require('@middlewares/authMiddleware');

router.post("/CreateParking", auth('admin', 'org'), Parking.CreateParking);
router.get("/getParking", auth('admin', 'org'), Parking.getParking);
router.post("/getParkingforRentSpot", auth('admin', 'org','user'), Parking.getParkingforRentSpot);
router.get("/getSingleParking/:id", auth('admin', 'org'), Parking.getSingleParking);
router.put("/updateParking/:id", auth('admin', 'org'), Parking.updateParking);
router.delete("/deleteParking/:id", auth('admin', 'org'), Parking.deleteParking);

router.post("/addSlot/:id", auth('admin', 'org'), Parking.addSlot);
router.delete("/removeSlot/:id/:slotId", auth('admin', 'org'), Parking.removeSlot);

router.post("/setMachine/:id", auth('admin', 'org'), Parking.setMachine);
router.delete("/removeMachine/:id", auth('admin', 'org'), Parking.removeMachine);

module.exports = router;