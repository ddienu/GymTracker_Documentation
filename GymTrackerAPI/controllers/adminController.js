import adminService from '../services/adminService.js';

const adminController = {
    async getAllClientsWithGoals(req, res, next) {
        try {
            const { id: userId } = req.user;
            const clients = await adminService.getAllClientsWithGoals(userId);
            res.status(200).json({
                message: 'All clients with goals retrieved successfully.',
                clients
            });
        } catch (error) {
            next(error);
        }
    },

    async getClientGoals(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { clientId } = req.params;
            const client = await adminService.getClientGoalsById(userId, clientId);
            res.status(200).json({
                message: 'Client goals retrieved successfully.',
                client
            });
        } catch (error) {
            next(error);
        }
    },

    async getAllProfessionalsWithClients(req, res, next) {
        try {
            const { id: userId } = req.user;
            const professionals = await adminService.getAllProfessionalsWithClients(userId);
            res.status(200).json({
                message: 'All professionals with assigned clients retrieved successfully.',
                professionals
            });
        } catch (error) {
            next(error);
        }
    },

    async assignClientToProfessional(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { clientId, professionalId } = req.body;

            if (!clientId || !professionalId) {
                return res.status(400).json({
                    message: 'clientId and professionalId are required.'
                });
            }

            const result = await adminService.assignClientToProfessional(userId, clientId, professionalId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    async getClientsByGoal(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { goalType } = req.params;
            const clients = await adminService.getClientsByGoal(userId, goalType);
            res.status(200).json({
                message: `Clients with goal '${goalType}' retrieved successfully.`,
                goal: goalType,
                clients
            });
        } catch (error) {
            next(error);
        }
    }
};

export default adminController;