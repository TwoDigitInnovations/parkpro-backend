const Report = require('@models/Report');
const response = require("../responses");
const notification = require("@models/notification");
const rentspot = require('@models/rentspot');
const Parking = require("@models/Parking");
const { notify } = require('@services/notification');
const { default: mongoose } = require('mongoose');
// const { notify } = require("../services/notification");

module.exports = {

    createReport: async (req, res) => {
        // console.log("AAAAAAA", req.user)
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
            if (req.file && req.file.location) {
                payload.image = req.file.location;
            }
            if (req.body.machin_id) {
                const parking = await Parking.find({
                        "machine.machineId": req.body.machin_id,
                      });
                      if (parking.length === 0) {
                        return response.badReq(res, {
                          message: 'Machine Id is not valid',
                        });
                      }
                      console.log('PARKING', parking[0]);
                      req.body.location=JSON.stringify(parking[0].location);
                      req.body.text_address=parking[0].address;
            }

            // console.log('payload',JSON.parse(payload?.location))
            payload.location=JSON.parse(payload?.location)
            let report = new Report(payload);
            // console.log('BBBBBB', payload)
            await report.save();
            // let noty = await notification.create({
            //     report_id: report._id,
            //     user_id: req.user.id,
            //     notification_title: 'New report created',
            //     notification_description: 'Your report is created successfully. Our team will take action shortly',
            // });
            // await notify(noty.report_id, noty.user_id, noty.notification_title, noty.notification_description);
            await notify(
            payload?.user,
            'New report created',
            'Your report is created successfully. Our team will take action shortly',
            );
            return response.ok(res, { message: 'Report added successfully' });
        } catch (error) {
            return response.error(res, error);
        }
    },

    getReport: async (req, res) => {
        try {
            const { page = 1, limit = 20, } = req.query;
            let cond = {};

            let startDate
            let endDate
            if (req.query.date) {
                startDate = new Date(req.query.date);
                console.log('SDDDD', startDate)
                endDate = new Date(new Date(req.query.date).setDate(startDate.getDate() + 1));
                console.log('EDDDD', endDate)
                cond.createdAt = { $gte: startDate, $lte: endDate };
            }

            if (req.query.key) {
                cond['$or'] = [
                    { issue_type: { $regex: req.query.key, $options: "i" } },
                ]
            }

            if (req.query.status) {
                cond['$or'] = [
                    { status: { $regex: req.query.status, $options: "i" } },
                ]
            }

            if (req.query.key && req.query.status && req.query.date) {
                cond['$or'] = [
                    { issue_type: { $regex: req.query.key, $options: "i" } },
                    { status: { $regex: req.query.status, $options: "i" } },
                    { createdAt: { $gte: startDate, $lte: endDate } },
                ]
            }

            let report = await Report.find(cond).populate('user', '-password')
            .sort({createdAt: -1,})
            .limit(limit * 1)
            .skip((page - 1) * limit);;
            return response.ok(res, report);
        } catch (error) {
            return response.error(res, error);
        }
    },
    getReportforuser: async (req, res) => {
        try {
            const { page = 1, limit = 20, } = req.query;

            let report = await Report.find({user:req.user.id}).populate('user', '-password')
            .sort({createdAt: -1,})
            .limit(limit * 1)
            .skip((page - 1) * limit);;
            return response.ok(res, report);
        } catch (error) {
            return response.error(res, error);
        }
    },
    getReportForGuard: async (req, res) => {
        try {
           const { page = 1, limit = 20 } = req.query;
const skip = (page - 1) * limit;
const userId = new mongoose.Types.ObjectId(req.user.id)
const payload=req.body
let obj ={rejectedguardandtech: { $nin: [userId] },status:{$in:['Accepted','Pending']}};
if (payload?.type==='technician') {
    obj.issue_type="Broken Kiosk"
}
else{
    obj.issue_type={ $ne: "Broken Kiosk" }
}
const report = await Report.aggregate([
  {
    $geoNear: {
      near: payload.location, // { type: "Point", coordinates: [lng, lat] }
      distanceField: 'distance',
      maxDistance: 1609.34 * 8, // 8 miles
      spherical: true,
    },
},
{ $match: obj },
  // populate "user"
  {
    $lookup: {
      from: 'users', // collection name in MongoDB (usually lowercase plural)
      localField: 'user', // field in Report
      foreignField: '_id', // field in User
      as: 'user',
    },
  },
  { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
  // populate "address"
  {
    $lookup: {
      from: 'addresses',
      localField: 'address',
      foreignField: '_id',
      as: 'address',
    },
  },
  { $unwind: { path: '$address', preserveNullAndEmptyArrays: true } },
  // remove password field
  {
    $project: {
      'user.password': 0,
    },
  },
  // pagination
  { $skip: skip },
  { $limit: parseInt(limit) },
  { $sort: { createdAt: -1 } },
]);

            return response.ok(res, report);
        } catch (error) {
            return response.error(res, error);
        }
    },

    updateVerifyandSuspendStatus: async (req, res) => {
        try {
            const payload = req?.body || {};
                payload.resolvedby=req.user.id

            let report = await Report.findByIdAndUpdate(payload?.id, payload, {
                new: true,
                upsert: true,
            });
            await notify(
            report?.user,
            `Report ${payload.status}`,
            `Your report has been ${payload.status}`,
            );
            return response.ok(res, report);
        } catch (error) {
            return response.error(res, error);
        }
    },
    getReportHistory: async (req, res) => {
        try {
            const { page = 1, limit = 20, } = req.query;

            let report = await Report.find({resolvedby:req.user.id}).populate('user', '-password')
            .sort({createdAt: -1,})
            .limit(limit * 1)
            .skip((page - 1) * limit);;
            return response.ok(res, report);
        } catch (error) {
            return response.error(res, error);
        }
    },
    updatereportstatus: async (req, res) => {
    try {
      const payload = req?.body || {};
      if (!payload.id || !payload.status) {
        return response.error(res, {
          message: 'Booking id and status are required',
        });
      }
    //   const update = { $set: { status: payload.status } };
      const update = {};
      if (payload.status === 'cancel') {
        // add instructor to rejectedbyinstructer array (no duplicates)
        update.$addToSet = { rejectedguardandtech: req.user.id };
    } else {
        update.accepted_by = req.user.id ;
        update.$set = { status: 'Accepted' };
      }
      const data = await Report.findByIdAndUpdate(payload?.id, update);
      if (payload.status === 'cancel') {
        // await notify(
        //   data?.user,
        //   'Session Canceled',
        //   'Your session was canceled by the instructor. Please select another instructor.',
        // );
      } else {
        await notify(
          data?.user,
          'Officer assigned',
          'Officer assigned to your report.',
        );
      }
      return response.ok(res, {
        message: `Report ${payload.status === 'cancel' ? 'Canceled' : 'Accepted'}`,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
