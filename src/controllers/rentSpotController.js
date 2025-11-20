const response = require('../responses');
const rentspot = require('@models/rentspot');
const addresses = require('@models/addresses');
const Parking = require('@models/Parking');

module.exports = {
  create_rentspot: async (req, res) => {
    try {
      req.body.user = req.user._id;
      let address = await addresses.findById(req.body.address);
      if (!address || !address.location) {
        return response.badReq(res, { message: 'Invalid address' });
      }
      // // find nearby address IDs
      // const nearbyAddresses = await addresses
      //   .find({
      //     location: {
      //       $near: {
      //         $geometry: address.location,
      //         $maxDistance: 1609.34 * 0.5, // 0.5 miles
      //       },
      //     },
      //   })
      //   .select('_id');
      // // Convert to plain array of IDs
      // const addressIds = nearbyAddresses.map((a) => a._id);
      // find rent spots within these addresses having same lot_number
      const parking = await rentspot.find({
        parking_id: req.body.parking_id,
        lot_number: { $in: req.body.lot_number },
      });
      if (parking.length > 0) {
        return response.badReq(res, {
          message: 'Lot no already taken by someone',
        });
      }

      let rent = new rentspot(req.body);
      await rent.save();
      return response.ok(res, rent);
    } catch (error) {
      return response.error(res, error);
    }
  },

  getrentspotByUserId: async (req, res) => {
    try {
      let rent = await rentspot
        .find({ user: req.user._id })
        .populate('address');
      return response.ok(res, rent);
    } catch (error) {
      return response.error(res, error);
    }
  },

  getrentspotById: async (req, res) => {
    try {
      let rent = await rentspot.findById(req.params.id).populate('address');
      return response.ok(res, rent);
    } catch (error) {
      return response.error(res, error);
    }
  },

  updaterentspot: async (req, res) => {
    try {
        let address = await addresses.findById(req.body.address);
      if (!address || !address.location) {
        return response.badReq(res, { message: 'Invalid address' });
      }
      // // find nearby address IDs
      // const nearbyAddresses = await addresses
      //   .find({
      //     location: {
      //       $near: {
      //         $geometry: address.location,
      //         $maxDistance: 1609.34 * 0.5, // 0.5 miles
      //       },
      //     },
      //   })
      //   .select('_id');
      // // Convert to plain array of IDs
      // const addressIds = nearbyAddresses.map((a) => a._id);
      // // find rent spots within these addresses having same lot_number
      const parking = await rentspot.find({
        parking_id: req.body.parking_id,
        lot_number: { $in: req.body.lot_number },
      });
      if (parking.length > 0) {
        return response.badReq(res, {
          message: 'Lot no already taken by someone',
        });
      }
      let rent = await rentspot.findByIdAndUpdate(req.params.id, req.body);
      return response.ok(res, rent);
    } catch (error) {
      return response.error(res, error);
    }
  },

  deleterentspotById: async (req, res) => {
    try {
      await rentspot.findByIdAndDelete(req.params.id);
      return response.ok(res, { message: 'Deleted successfully' });
    } catch (error) {
      return response.error(res, error);
    }
  },
  rentspotAndAddressNumber: async (req, res) => {
    try {
      console.log("user id",req.user.id)
      const rentspotd=await rentspot.find({ user: req.user.id });
      let address = await addresses.find({ user: req.user.id })
      return response.ok(res, {rentspot:rentspotd?.length,address:address?.length });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
