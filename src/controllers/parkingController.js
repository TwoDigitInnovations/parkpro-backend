const Parking = require("@models/Parking");
const response = require("../responses");

module.exports = {
    CreateParking: async (req, res) => {
        try {
            req.body.organization = req.user._id;
            let parking = new Parking(req.body);
            await parking.save();
            return response.ok(res, parking);
        } catch (error) {
            return response.error(res, error);
        }
    },

    getParking: async (req, res) => {
        try {
            let parking = await Parking.find({ organization: req.user._id });
            return response.ok(res, parking);
        } catch (error) {
            return response.error(res, error);
        }
    },

    getSingleParking: async (req, res) => {
        try {
            const parking = await Parking.findOne({
                _id: req.params.id,
                organization: req.user._id
            });

            if (!parking) return response.notFound(res, "Parking Not Found");
            return response.ok(res, parking);
        } catch (error) {
            return response.error(res, error);
        }
    },

    updateParking: async (req, res) => {
        try {
            const parking = await Parking.findOneAndUpdate(
                { _id: req.params.id, organization: req.user._id },
                req.body,
                { new: true }
            );

            if (!parking) return response.notFound(res, "Parking Not Found");
            return response.ok(res, parking);
        } catch (error) {
            return response.error(res, error);
        }
    },

    deleteParking: async (req, res) => {
        try {
            const parking = await Parking.findOneAndDelete({
                _id: req.params.id,
                organization: req.user._id
            });

            if (!parking) return response.notFound(res, "Parking Not Found");

            return response.ok(res, "Parking Deleted Successfully");
        } catch (error) {
            return response.error(res, error);
        }
    },

    addSlot: async (req, res) => {
        try {
            const { slotNo, forWheel } = req.body;

            const parking = await Parking.findOne({
                _id: req.params.id,
                organization: req.user._id
            });

            if (!parking) return response.notFound(res, "Parking Not Found");

            parking.parkingSlots.push({ slotNo, forWheel });
            await parking.save();

            return response.ok(res, parking);
        } catch (error) {
            return response.error(res, error);
        }
    },

    removeSlot: async (req, res) => {
        try {
            const parking = await Parking.findOne({
                _id: req.params.id,
                organization: req.user._id
            });

            if (!parking) return response.notFound(res, "Parking Not Found");

            parking.parkingSlots = parking.parkingSlots.filter(
                (slot) => slot._id.toString() !== req.params.slotId
            );

            await parking.save();

            return response.ok(res, parking);
        } catch (error) {
            return response.error(res, error);
        }
    },

    setMachine: async (req, res) => {
        try {
            const { machineId, machineName } = req.body;

            const parking = await Parking.findOne({ _id: req.params.id, organization: req.user._id });

            if (!parking) return response.notFound(res, "Parking Not Found");

            if (!Array.isArray(parking.machine)) {
                parking.machine = [];
            }

            parking.machine.push({ machineId, machineName });

            await parking.save();

            return response.ok(res, parking);
        } catch (error) {
            return response.error(res, error);
        }
    },


    removeMachine: async (req, res) => {
        try {
            const parking = await Parking.findOne({
                _id: req.params.id,
                organization: req.user._id
            });

            if (!parking) return response.notFound(res, "Parking Not Found");

            parking.machine = undefined;
            await parking.save();

            return response.ok(res, parking);
        } catch (error) {
            return response.error(res, error);
        }
    }

};
