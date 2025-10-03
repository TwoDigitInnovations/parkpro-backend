'use strict';

const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema(
    {
        notification_title: {
            type: String,
        },
        notification_description: {
            type: String,
        },
        report_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report",
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    }, {
    timestamps: true
});

notificationSchema.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Notification', notificationSchema);