
const Building = require("@models/building");
const response = require("../responses");

module.exports = {
    create_building: async (req, res) => {
        try {
            const payload = req.body;
            payload.user = req.user._id
            if (req.file && req.file.location) {
            payload.building_image = req.file.location;
            }
            let building = new Building(payload)
            await building.save()
            return response.ok(res, building);
        } catch (error) {
            return response.error(res, error);
        }
    },

    getAllBuilding: async (req, res) => {
        try {
            const { page = 1, limit = 20 } = req.query;
            let building = await Building.find().sort({
          createdAt: -1,
        })
        .limit(limit * 1)
        .skip((page - 1) * limit);
            return response.ok(res, building);
        } catch (error) {
            return response.error(res, error);
        }
    },

    getBuildingById: async (req, res) => {
        try {
            let building = await Building.findById(req.params.id)
            return response.ok(res, building);
        } catch (error) {
            return response.error(res, error);
        }
    },

    updateBuilding: async (req, res) => {
        try {
            const payload = req.body;
            if (req.file && req.file.location) {
            payload.building_image = req.file.location;
            }
            let building = await Building.findByIdAndUpdate(req.params.id, payload)
            return response.ok(res, building);
        } catch (error) {
            return response.error(res, error);
        }
    },

    deleteBuildingById: async (req, res) => {
        try {
            await Building.findByIdAndDelete(req.params.id)
            return response.ok(res, { message: 'Deleted successfully' });
        } catch (error) {
            return response.error(res, error);
        }
    },
}