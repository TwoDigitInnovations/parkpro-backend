const express = require('express');
const router = express.Router();
const Kiosk = require('@controllers/kioskController');
const auth = require('@middlewares/authMiddleware');
const { upload } = require('@services/fileUpload');

router.post(
  '/create',
  auth('admin', 'superadmin', 'landlord_admin'),
  upload.single('photo'),
  Kiosk.createKiosk,
);
router.get(
  '/getAll',
  auth('admin', 'superadmin', 'landlord_admin'),
  Kiosk.getAllKiosks,
);
router.get(
  '/getSingle/:id',
  auth('admin', 'superadmin', 'landlord_admin'),
  Kiosk.getSingleKiosk,
);
router.put(
  '/update/:id',
  auth('admin', 'superadmin', 'landlord_admin'),
  upload.single('photo'),
  Kiosk.updateKiosk,
);
router.delete(
  '/delete/:id',
  auth('admin', 'superadmin', 'landlord_admin'),
  Kiosk.deleteKiosk,
);
router.patch(
  '/updateStatus/:id',
  auth('admin', 'superadmin', 'landlord_admin'),
  Kiosk.updateStatus,
);

module.exports = router;
