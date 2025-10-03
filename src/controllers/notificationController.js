const Notification = require('@models/notification');
const response = require("../responses");

module.exports = {

    getNotification: async (req, res) => {
        try {
            let notification = await Notification.find()
            return response.ok(res, notification);
        } catch (error) {
            return response.error(res, error);
        }
    },
}