'use strict';
const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const pricingSchema = new mongoose.Schema(
  {
    hourly_rate: {
      type: Number,
      min: 0,
      default: 0,
    },
    daily_rate: {
      type: Number,
      min: 0,
      default: 0,
    },
    monthly_rate: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { _id: false },
);

const parkingSlotSchema = new mongoose.Schema(
  {
    slot_label: {
      type: String,     // Landlord defines freely: "A1", "P3", "Slot 7", "Norra-1"
      required: true,
    },
    position: {
    row: Number,
    column: Number
  },
    // status: {
    //   type: String,
    //   enum: ['Available', 'Occupied'],
    //   default: 'Available',
    // },
    // current_booking: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Booking',
    //   default: null,   // populated when Occupied
    // },
  },
  { timestamps: true },
);

const parkingLotsSchema = new mongoose.Schema(
  {
    space_id: {
      type: String,
    },
    address: {
      type: String,
    },
    vehicle_type: [{
      type: String,
    }],
    // rental_rule: {
    //   type: String,
    //   enum:['Hourly','Monthly','Daily']
    // },
    pricing: {
      type: pricingSchema,
    },
    slots:  [parkingSlotSchema],
    availability: {
      type: String,
      enum: ['Available', 'Blocked'],
    },
    access_mode: {
      type: String,
      enum: ['Tenant only', 'Open'],
    },
    enable_queue: {
      type: String,
      enum: ['Off', 'On'],
    },
    location: {
      type: pointSchema,
    },
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Building',
    },
    CreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

parkingLotsSchema.virtual('available_slots_count').get(function () {
  return this.slots.filter((s) => s.status === 'Available').length;
});

// Virtual: how many slots are occupied right now
parkingLotsSchema.virtual('occupied_slots_count').get(function () {
  return this.slots.filter((s) => s.status === 'Occupied').length;
});

parkingLotsSchema.set('toJSON', {
  getters: true,
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
    return ret;
  },
});

parkingLotsSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('ParkingLot', parkingLotsSchema);
