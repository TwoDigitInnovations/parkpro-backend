
const addresses = require("@models/addresses");
const response = require("../responses");

module.exports = {
    create_address: async (req, res) => {
        try {
            req.body.user = req.user._id
            let address = new addresses(req.body)
            await address.save()
            return response.ok(res, address);
        } catch (error) {
            return response.error(res, error);
        }
    },

    getAddressByUserId: async (req, res) => {
        try {
            let address = await addresses.find({ user: req.user._id })
            return response.ok(res, address);
        } catch (error) {
            return response.error(res, error);
        }
    },

    getAddressById: async (req, res) => {
        try {
            let address = await addresses.findById(req.params.id)
            return response.ok(res, address);
        } catch (error) {
            return response.error(res, error);
        }
    },

    updateAddress: async (req, res) => {
        try {
            let address = await addresses.findByIdAndUpdate(req.params.id, req.body)
            return response.ok(res, address);
        } catch (error) {
            return response.error(res, error);
        }
    },

    deleteAddressById: async (req, res) => {
        try {
            await addresses.findByIdAndDelete(req.params.id)
            return response.ok(res, { message: 'Deleted successfully' });
        } catch (error) {
            return response.error(res, error);
        }
    },
}