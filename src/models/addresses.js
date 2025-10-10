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


const addressSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        full_address: {
            type: String,
        },
        city: {
            type: String,
        },
        postalcode: {
            type: String,
        },
        location: {
            type: pointSchema,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    }, {
    timestamps: true
});

addressSchema.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});

addressSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Address', addressSchema);