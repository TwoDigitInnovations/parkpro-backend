'use strict';
const mongoose = require('mongoose');

const rentSpotSchema = new mongoose.Schema(
    {
        lot_number: [{
            type: String,
        }],
        address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        parking_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Parking",
        },
    }, {
    timestamps: true
});

rentSpotSchema.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});



module.exports = mongoose.model('RentSpot', rentSpotSchema);