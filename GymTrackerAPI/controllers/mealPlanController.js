import mealPlanService from '../services/mealPlanService.js';

const mealPlanController = {
    async createMealPlan(req, res, next) {
        try {
            const { id: professionalId } = req.user;
            const planData = req.body;
            const newPlan = await mealPlanService.createMealPlan(professionalId, planData);
            res.status(201).json(newPlan);
        } catch (error) {
            next(error);
        }
    },

    async getMealPlansByClient(req, res, next) {
        try {
            const { clientId } = req.params;
            const { id: userId } = req.user;
            const plans = await mealPlanService.getMealPlansByClient(userId, clientId);
            res.status(200).json(plans);
        } catch (error) {
            next(error);
        }
    },

    async getMealPlanById(req, res, next) {
        try {
            const { planId } = req.params;
            const { id: userId } = req.user;
            const plan = await mealPlanService.getMealPlanById(userId, planId);
            res.status(200).json(plan);
        } catch (error) {
            next(error);
        }
    },

    async updateMealPlan(req, res, next) {
        try {
            const { planId } = req.params;
            const { id: userId } = req.user;
            const planData = req.body;
            const updatedPlan = await mealPlanService.updateMealPlan(userId, planId, planData);
            res.status(200).json(updatedPlan);
        } catch (error) {
            next(error);
        }
    },

    async deleteMealPlan(req, res, next) {
        try {
            const { planId } = req.params;
            const { id: userId } = req.user;
            await mealPlanService.deleteMealPlan(userId, planId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },

    async addMealToPlan(req, res, next) {
        try {
            const { planId } = req.params;
            const { id: userId } = req.user;
            const mealData = req.body;
            const newMeal = await mealPlanService.addMealToPlan(userId, planId, mealData);
            res.status(201).json(newMeal);
        } catch (error) {
            next(error);
        }
    },

    async updateMealInPlan(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { planId, mealPlanMealId } = req.params;
            const mealData = req.body;
            const updatedMeal = await mealPlanService.updateMealInPlan(userId, planId, mealPlanMealId, mealData);
            res.status(200).json(updatedMeal);
        } catch (error) {
            next(error);
        }
    },

    async removeMealFromPlan(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { planId, mealPlanMealId } = req.params;
            await mealPlanService.removeMealFromPlan(userId, planId, mealPlanMealId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
};

export default mealPlanController; 