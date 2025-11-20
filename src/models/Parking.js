'use strict';
const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["Point"],
        default: "Point"
    },
    coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
    }
});

const slotSchema = new mongoose.Schema({
    slotNo: {
        type: String,
        required: true
    },
    forWheel: {
        type: Boolean,
        required: true
    }
});

const machineSchema = new mongoose.Schema({
    machineId: {
        type: String,
        required: true
    },
    machineName: {
        type: String,
        required: true
    }
});

const parkingSchema = new mongoose.Schema(
    {
        parkingName: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        location: {
            type: pointSchema,
            required: true
        },
        parkingSlots: {
            type: [slotSchema],   // array of slots
            default: []
        },
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        machine: [machineSchema]   // single machine object
    },
    {
        timestamps: true
    }
);


parkingSchema.set('toJSON', {
    virtuals: false,
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    }
});
parkingSchema.index({ location: "2dsphere" });
module.exports = mongoose.model('Parking', parkingSchema);
