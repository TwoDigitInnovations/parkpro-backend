
const response = require("../responses");
const rentspot = require("@models/rentspot");

module.exports = {
    create_rentspot: async (req, res) => {
        try {
            req.body.user = req.user._id
            let rent = new rentspot(req.body)
            await rent.save()
            return response.ok(res, rent);
        } catch (error) {
            return response.error(res, error);
        }
    },

    getrentspotByUserId: async (req, res) => {
        try {
            let rent = await rentspot.find({ user: req.user._id }).populate('address')
            return response.ok(res, rent);
        } catch (error) {
            return response.error(res, error);
        }
    },

    getrentspotById: async (req, res) => {
        try {
            let rent = await rentspot.findById(req.params.id)
            return response.ok(res, rent);
        } catch (error) {
            return response.error(res, error);
        }
    },

    updaterentspot: async (req, res) => {
        try {
            let rent = await rentspot.findByIdAndUpdate(req.params.id, req.body)
            return response.ok(res, rent);
        } catch (error) {
            return response.error(res, error);
        }
    },

    deleterentspotById: async (req, res) => {
        try {
            await rentspot.findByIdAndDelete(req.params.id)
            return response.ok(res, { message: 'Deleted successfully' });
        } catch (error) {
            return response.error(res, error);
        }
    },
}