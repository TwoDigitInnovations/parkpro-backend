'use strict';
const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["Point"],
        default: "Point"
    },
    coordinates: {
        type: [Number],
        required: true
    },
});


const parkingLotsSchema = new mongoose.Schema(
    {
        space_id: {
            type: String,
        },
        address: {
            type: String,
        },
        vehicle_type: {
            type: String,
        },
        rental_rule: {
            type: String,
        },
        availability: {
            type: String,
            enum: ["Available", "Blocked"],
        },
        access_mode: {
            type: String,
            enum: ["Tenant only", "Open"],
        },
        enable_queue: {
            type: String,
            enum: ["Off", "On"],
        },
        location: {
            type: pointSchema,
        },
        building: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Building",
        },
    }, {
    timestamps: true
});

parkingLotsSchema.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});

parkingLotsSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('ParkingLot', parkingLotsSchema);