import CustomError from '../utils/CustomError.js';
import mealPlanRepository from '../repositories/mealPlanRepository.js';
import mealPlanMealRepository from '../repositories/mealPlanMealRepository.js';
import professionalRepository from '../repositories/professionalRepository.js';
import clientRepository from '../repositories/clientRepository.js';
import roleRepository from '../repositories/roleRepository.js';
import db from '../config/db.js';

const mealPlanService = {
    async _verifyUserIsProfessional(userId, connection) {
        const roles = await roleRepository.findRolesByUserId(userId, connection);
        if (!roles.some(role => role.name === 'PROFESSIONAL')) {
            throw new CustomError('User does not have a PROFESSIONAL role.', 403);
        }
        const professional = await professionalRepository.findByUserId(userId, connection);
        if (!professional) {
            throw new CustomError('Professional profile not found for this user.', 404);
        }
        return professional;
    },

    async createMealPlan(professionalUserId, planData) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            const professional = await this._verifyUserIsProfessional(professionalUserId, connection);
            const client = await clientRepository.findById(planData.client_id, connection);
            if (!client) throw new CustomError('Client not found.', 404);

            const newPlan = await mealPlanRepository.create({ ...planData, professional_id: professional.professional_id }, connection);
            await connection.commit();
            return newPlan;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async getMealPlansByClient(requesterUserId, clientId) {
        const connection = await db.getConnection();
        try {
            // Permission check logic (similar to ExercisePlan)
            return await mealPlanRepository.findByClientId(clientId, connection);
        } finally {
            connection.release();
        }
    },

    async getMealPlanById(requesterUserId, planId) {
        const connection = await db.getConnection();
        try {
            const plan = await mealPlanRepository.findById(planId, connection);
            if (!plan) throw new CustomError('Meal plan not found.', 404);
            // Permission check logic
            plan.meals = await mealPlanMealRepository.findByPlanId(planId, connection);
            return plan;
        } finally {
            connection.release();
        }
    },

    async _verifyPlanPermissions(requesterUserId, planId, connection) {
        const plan = await mealPlanRepository.findById(planId, connection);
        if (!plan) throw new CustomError('Meal plan not found.', 404);

        const professional = await professionalRepository.findByUserId(requesterUserId, connection);
        const isAdmin = (await roleRepository.findRolesByUserId(requesterUserId, connection)).some(r => r.name === 'ADMIN');

        if ((!professional || plan.professional_id !== professional.professional_id) && !isAdmin) {
            throw new CustomError('Access Denied. You can only modify plans you have created.', 403);
        }
        return plan;
    },

    async updateMealPlan(requesterUserId, planId, planData) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            await this._verifyPlanPermissions(requesterUserId, planId, connection);
            await mealPlanRepository.update(planId, planData, connection);
            await connection.commit();
            return await this.getMealPlanById(requesterUserId, planId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async deleteMealPlan(requesterUserId, planId) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            await this._verifyPlanPermissions(requesterUserId, planId, connection);
            await mealPlanRepository.delete(planId, connection);
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async addMealToPlan(requesterUserId, planId, mealData) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            await this._verifyPlanPermissions(requesterUserId, planId, connection);
            const newMeal = await mealPlanMealRepository.create({ meal_plan_id: planId, ...mealData }, connection);
            await connection.commit();
            return newMeal;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async updateMealInPlan(requesterUserId, planId, mealPlanMealId, mealData) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            await this._verifyPlanPermissions(requesterUserId, planId, connection);
            await mealPlanMealRepository.update(mealPlanMealId, mealData, connection);
            await connection.commit();
            return await mealPlanMealRepository.findById(mealPlanMealId, connection);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async removeMealFromPlan(requesterUserId, planId, mealPlanMealId) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            await this._verifyPlanPermissions(requesterUserId, planId, connection);
            await mealPlanMealRepository.delete(mealPlanMealId, connection);
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};

export default mealPlanService; 