
"use strict";
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        license_plate_no: {
            type: Number,
        },
        image: {
            type: String
        },
        issue_type: {
            type: String,
        },
        address: {
            type: String,
        },
        machin_id: {
            type: String,
        },
        description:{
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        status: {
            type: String,
            enum: ['Pending', 'Verified', 'Suspended'],
            default: 'Pending'
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
    }
);

reportSchema.set("toJSON", {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model("Report", reportSchema);