const Report = require('@models/Report');
const response = require("../responses");
const notification = require("@models/notification");
// const { notify } = require("../services/notification");

module.exports = {

    createReport: async (req, res) => {
        console.log("AAAAAAA", req.user)
        const payload = req?.body || {};
        // let photoUrl = [];

        // if (req.files.photo) {
        //     const imageFile = req.files.photo;
        //     try {
        //         await Promise.all(imageFile.map(async (file) => {
        //             const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

        //             const result = await cloudinary.uploader.upload(base64Image, {
        //                 folder: 'proxi',
        //                 resource_type: 'auto',
        //                 timeout: 60000
        //             });
        //             photoUrl.push(result.secure_url)
        //         }));
        //     } catch (uploadError) {
        //         console.error('Cloudinary upload error:', uploadError);
        //         return res.status(500).json({
        //             success: false,
        //             message: 'Error uploading image: ' + uploadError.message
        //         });
        //     }
        // } else {
        //     // console.log('No image file found in request');
        // }

        // if (photoUrl) {
        //     if (req.body.oldImages) {
        //         const oldImages = JSON.parse(req.body.oldImages)
        //         req.body.photo = [...oldImages, ...photoUrl]
        //     } else {
        //         req.body.photo = [...photoUrl]
        //     }
        // }

        try {
            payload.user = req.user.id;
            let report = new Report(payload);
            // console.log('BBBBBB', payload)
            await report.save();
            let noty = await notification.create({
                report_id: report._id,
                user_id: req.user.id,
                notification_title: 'New report created',
                notification_description: 'Your report is created successfully. Our team will take action shortly',
            });
            // await notify(noty.report_id, noty.user_id, noty.notification_title, noty.notification_description);
            return response.ok(res, { message: 'Report added successfully' });
        } catch (error) {
            return response.error(res, error);
        }
    },

    getReport: async (req, res) => {
        try {
            let report = await Report.find().populate('user', '-password')
            return response.ok(res, report);
        } catch (error) {
            return response.error(res, error);
        }
    },

    updateVerifyandSuspendStatus: async (req, res) => {
        try {
            const payload = req?.body || {};
            let report = await Report.findByIdAndUpdate(payload?.id, payload, {
                new: true,
                upsert: true,
            });
            return response.ok(res, report);
        } catch (error) {
            return response.error(res, error);
        }
    },
};
