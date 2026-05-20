'use strict';
const mongoose = require('mongoose');

const parkingPermitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    holderName: {
      type: String,
      required: true,
    },
    holderEmail: {
      type: String,
      required: true,
    },
    licensePlate: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Resident', 'Visitor', 'Employee', 'Disabled', 'Temporary'],
      default: 'Resident',
    },
    parkingLot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingLot',
    },
    effectiveDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Expired', 'Cancelled'],
      default: 'Active',
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

parkingPermitSchema.set('toJSON', {
  virtuals: false,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('ParkingPermit', parkingPermitSchema);
