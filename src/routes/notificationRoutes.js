const express = require('express');
const router = express.Router();
const { getNotification } = require('@controllers/notificationController');
const auth = require('@middlewares/authMiddleware');

router.get('/getNotification', auth('admin'), getNotification);

module.exports = router;