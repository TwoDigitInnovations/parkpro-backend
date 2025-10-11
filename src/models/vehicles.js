'use strict';
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        number_plate: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    }, {
    timestamps: true
});

vehicleSchema.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});



module.exports = mongoose.model('Vehicle', vehicleSchema);