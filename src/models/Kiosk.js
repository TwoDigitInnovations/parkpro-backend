'use strict';
const mongoose = require('mongoose');

const kioskSchema = new mongoose.Schema(
  {
    kioskName: {
      type: String,
      required: true,
      trim: true,
    },
    modelNumber: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    zoneAssignment: {
      type: String,
    },
    streetAddress: {
      type: String,
    },
    connectionType: {
      type: String,
    },
    deploymentStatus: {
      type: String,
      enum: ['Active', 'Inactive', 'Maintenance', 'Pending'],
      default: 'Pending',
    },
    photo: {
      type: String,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

kioskSchema.set('toJSON', {
  virtuals: false,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

kioskSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Kiosk', kioskSchema);
