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

const reportSchema = new mongoose.Schema(
  {
    license_plate_no: {
      type: Number,
    },
    image: {
      type: String,
    },
    issue_type: {
      type: String,
    },
    wrong_parking_type: {
      type: String,
    },
    machine_issue_type: {
      type: String,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },
    text_address: {
      type: String,
    },
    machin_id: {
      type: String,
    },
    description: {
      type: String,
    },
    status_description: {
      type: String,
    },
    location: {
      type: pointSchema,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    accepted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectedguardandtech: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['Pending', 'Accepted','Penalty issued','Vehicle Missing','Resolve','Unresolve'],
      default: 'Pending',
    },
    // verified: {
    //     type: Boolean,
    //     default: false,
    // },
    // phone: {
    //     type: String
    // }
  },
  {
    timestamps: true,
  },
);

reportSchema.set('toJSON', {
  getters: true,
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
    return ret;
  },
});

reportSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Report', reportSchema);
