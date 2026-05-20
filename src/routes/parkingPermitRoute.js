const express = require('express');
const router = express.Router();
const Permit = require('@controllers/parkingPermitController');
const auth = require('@middlewares/authMiddleware');

router.post(
  '/create',
  auth('admin', 'superadmin', 'landlord_admin'),
  Permit.createPermit,
);
router.get(
  '/getAll',
  auth('admin', 'superadmin', 'landlord_admin'),
  Permit.getAllPermits,
);
router.get(
  '/getSingle/:id',
  auth('admin', 'superadmin', 'landlord_admin'),
  Permit.getSinglePermit,
);
router.put(
  '/update/:id',
  auth('admin', 'superadmin', 'landlord_admin'),
  Permit.updatePermit,
);
router.delete(
  '/delete/:id',
  auth('admin', 'superadmin', 'landlord_admin'),
  Permit.deletePermit,
);
router.patch(
  '/updateStatus/:id',
  auth('admin', 'superadmin', 'landlord_admin'),
  Permit.updateStatus,
);

module.exports = router;
