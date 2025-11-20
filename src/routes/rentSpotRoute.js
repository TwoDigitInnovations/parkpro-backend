const express = require('express');
const router = express.Router();
const auth = require('@middlewares/authMiddleware');
const { create_rentspot, getrentspotByUserId, updaterentspot, deleterentspotById, getrentspotById,rentspotAndAddressNumber } = require('@controllers/rentSpotController');



router.post('/create-rentspot', auth('user'), create_rentspot);
router.get('/getrentspotByUserId', auth('user'), getrentspotByUserId);
router.post('/update/:id', auth('user'), updaterentspot);
router.delete('/delete/:id', auth('user'), deleterentspotById);
router.get('/rentspotAndAddressNumber', auth('user'), rentspotAndAddressNumber);
router.get('/:id', auth('user'), getrentspotById);


module.exports = router;