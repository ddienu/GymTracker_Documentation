import exercisePlanService from '../services/exercisePlanService.js';

const exercisePlanController = {
    async createExercisePlan(req, res, next) {
        try {
            const requesterId = req.user.id;
            const planData = req.body;
            const newPlan = await exercisePlanService.createExercisePlan(requesterId, planData);
            res.status(201).json(newPlan);
        } catch (error) {
            next(error);
        }
    },

    async getExercisePlansByClient(req, res, next) {
        try {
            const { clientId } = req.params;
            const requesterId = req.user.id;
            const plans = await exercisePlanService.getExercisePlansByClient(requesterId, clientId);
            res.status(200).json(plans);
        } catch (error) {
            next(error);
        }
    },

    async getExercisePlanById(req, res, next) {
        try {
            const { planId } = req.params;
            const requesterId = req.user.id;
            const plan = await exercisePlanService.getExercisePlanById(requesterId, planId);
            res.status(200).json(plan);
        } catch (error) {
            next(error);
        }
    },

    async updateExercisePlan(req, res, next) {
        try {
            const { planId } = req.params;
            const requesterId = req.user.id;
            const planData = req.body;
            const updatedPlan = await exercisePlanService.updateExercisePlan(requesterId, planId, planData);
            res.status(200).json(updatedPlan);
        } catch (error) {
            next(error);
        }
    },

    async deleteExercisePlan(req, res, next) {
        try {
            const { planId } = req.params;
            const requesterId = req.user.id;
            await exercisePlanService.deleteExercisePlan(requesterId, planId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },

    async addExerciseToPlan(req, res, next) {
        try {
            const { planId } = req.params;
            const requesterId = req.user.id;
            const exerciseData = req.body;
            const newExercise = await exercisePlanService.addExerciseToPlan(requesterId, planId, exerciseData);
            res.status(201).json(newExercise);
        } catch (error) {
            next(error);
        }
    },

    async updateExerciseInPlan(req, res, next) {
        try {
            const requesterId = req.user.id;
            const { planId, plannedExerciseId } = req.params;
            const exerciseData = req.body;
            const updatedExercise = await exercisePlanService.updateExerciseInPlan(requesterId, planId, plannedExerciseId, exerciseData);
            res.status(200).json(updatedExercise);
        } catch (error) {
            next(error);
        }
    },

    async removeExerciseFromPlan(req, res, next) {
        try {
            const requesterId = req.user.id;
            const { planId, plannedExerciseId } = req.params;
            await exercisePlanService.removeExerciseFromPlan(requesterId, planId, plannedExerciseId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
};

export default exercisePlanController; 