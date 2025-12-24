import availabilityService from '../services/availabilityService.js';

const availabilityController = {
    async addAvailability(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { start_time, end_time } = req.body;

            const newSlot = await availabilityService.addAvailability(userId, { start_time, end_time });

            res.status(201).json({
                message: 'Availability slot added successfully.',
                slot: newSlot
            });
        } catch (error) {
            next(error);
        }
    },

    async getMyAvailability(req, res, next) {
        try {
            const { id: userId } = req.user;
            const slots = await availabilityService.getMyAvailability(userId);
            res.status(200).json(slots);
        } catch (error) {
            next(error);
        }
    },

    async deleteAvailability(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { id: availabilityId } = req.params;

            await availabilityService.deleteAvailability(userId, availabilityId);

            res.status(200).json({ message: 'Availability slot deleted successfully.' });
        } catch (error) {
            next(error);
        }
    }
};

export default availabilityController; 