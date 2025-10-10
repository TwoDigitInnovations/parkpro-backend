const express = require('express');
const router = express.Router();
const auth = require('@middlewares/authMiddleware');
const {
    create_address,
    getAddressByUserId,
    deleteAddressById,
    getAddressById,
    updateAddress
} = require('@controllers/addressController');

router.post('/create-address', auth('user'), create_address);
router.get('/getAddressByUserId', auth('user'), getAddressByUserId);
router.post('/update/:id', auth('user'), updateAddress);
router.delete('/delete/:id', auth('user'), deleteAddressById);
router.get('/:id', auth('user'), getAddressById);


module.exports = router;