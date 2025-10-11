
const vehicles = require("@models/vehicles");
const response = require("../responses");

module.exports = {
    create_vehicle: async (req, res) => {
        try {
            req.body.user = req.user._id
            let vehicle = new vehicles(req.body)
            await vehicle.save()
            return response.ok(res, vehicle);
        } catch (error) {
            return response.error(res, error);
        }
    },

    getVehicleByUserId: async (req, res) => {
        try {
            let vehicle = await vehicles.find({ user: req.user._id })
            return response.ok(res, vehicle);
        } catch (error) {
            return response.error(res, error);
        }
    },

    getVehicleById: async (req, res) => {
        try {
            let vehicle = await vehicles.findById(req.params.id)
            return response.ok(res, vehicle);
        } catch (error) {
            return response.error(res, error);
        }
    },

    updateVehicle: async (req, res) => {
        try {
            let vehicle = await vehicles.findByIdAndUpdate(req.params.id, req.body)
            return response.ok(res, vehicle);
        } catch (error) {
            return response.error(res, error);
        }
    },

    deleteVehicleById: async (req, res) => {
        try {
            await vehicles.findByIdAndDelete(req.params.id)
            return response.ok(res, { message: 'Deleted successfully' });
        } catch (error) {
            return response.error(res, error);
        }
    },
}