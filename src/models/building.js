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


const buildingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        phone_no: {
            type: String,
        },
        contact_no: {
            type: String,
        },
        house_no: {
            type: String,
        },
        street_name: {
            type: String,
        },
        city: {
            type: String,
        },
        postalcode: {
            type: String,
        },
        building_image: {
            type: String,
        },
        location: {
            type: pointSchema,
        },
    }, {
    timestamps: true
});

buildingSchema.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});

buildingSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Building', buildingSchema);