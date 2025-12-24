import CustomError from '../utils/CustomError.js';
import exercisePlanRepository from '../repositories/exercisePlanRepository.js';
import plannedExerciseRepository from '../repositories/plannedExerciseRepository.js';
import professionalRepository from '../repositories/professionalRepository.js';
import clientRepository from '../repositories/clientRepository.js';
import roleRepository from '../repositories/roleRepository.js';
import db from '../config/db.js';

const exercisePlanService = {
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

    async createExercisePlan(professionalUserId, planData) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            const professional = await this._verifyUserIsProfessional(professionalUserId, connection);
            
            const client = await clientRepository.findById(planData.client_id, connection);
            if (!client) {
                throw new CustomError('Client specified in the plan does not exist.', 404);
            }

            const newPlanData = {
                ...planData,
                professional_id: professional.professional_id,
            };

            const newPlan = await exercisePlanRepository.create(newPlanData, connection);
            await connection.commit();
            return newPlan;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async getExercisePlansByClient(requesterUserId, clientId) {
        const connection = await db.getConnection();
        try {
            const requesterRoles = await roleRepository.findRolesByUserId(requesterUserId, connection);
            const requesterClientProfile = await clientRepository.findByUserId(requesterUserId, connection);

            const isOwner = requesterClientProfile && requesterClientProfile.client_id === Number(clientId);
            const isAdmin = requesterRoles.some(r => r.name === 'ADMIN');
            
            if (!isOwner && !isAdmin) {
                const professional = await professionalRepository.findByUserId(requesterUserId, connection);
                if (!professional) {
                    throw new CustomError('Access Denied. You are not authorized to view these plans.', 403);
                }
            }
            
            return await exercisePlanRepository.findByClientId(clientId, connection);
        } finally {
            connection.release();
        }
    },

    async getExercisePlanById(requesterUserId, planId) {
        const connection = await db.getConnection();
        try {
            const plan = await exercisePlanRepository.findById(planId, connection);
            if (!plan) {
                throw new CustomError('Exercise plan not found.', 404);
            }

            const requesterRoles = await roleRepository.findRolesByUserId(requesterUserId, connection);
            const requesterClientProfile = await clientRepository.findByUserId(requesterUserId, connection);

            const isPlanOwner = requesterClientProfile && requesterClientProfile.client_id === plan.client_id;
            const isPlanCreator = plan.professional_id === (await professionalRepository.findByUserId(requesterUserId, connection))?.professional_id;
            const isAdmin = requesterRoles.some(r => r.name === 'ADMIN');

            if (!isPlanOwner && !isPlanCreator && !isAdmin) {
                throw new CustomError('Access Denied. You are not authorized to view this plan.', 403);
            }

            plan.exercises = await plannedExerciseRepository.findByPlanId(planId, connection);
            return plan;
        } finally {
            connection.release();
        }
    },

    async updateExercisePlan(requesterUserId, planId, planData) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            const plan = await exercisePlanRepository.findById(planId, connection);
            if (!plan) {
                throw new CustomError('Exercise plan not found.', 404);
            }
            
            const professional = await this._verifyUserIsProfessional(requesterUserId, connection);
            const isAdmin = (await roleRepository.findRolesByUserId(requesterUserId, connection)).some(r => r.name === 'ADMIN');

            if (plan.professional_id !== professional.professional_id && !isAdmin) {
                throw new CustomError('Access Denied. You can only update plans you have created.', 403);
            }

            await exercisePlanRepository.update(planId, planData, connection);
            await connection.commit();
            
            return await this.getExercisePlanById(requesterUserId, planId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async deleteExercisePlan(requesterUserId, planId) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            const plan = await exercisePlanRepository.findById(planId, connection);
            if (!plan) {
                throw new CustomError('Exercise plan not found.', 404);
            }

            const professional = await professionalRepository.findByUserId(requesterUserId, connection);
            const isAdmin = (await roleRepository.findRolesByUserId(requesterUserId, connection)).some(r => r.name === 'ADMIN');

            if ((!professional || plan.professional_id !== professional.professional_id) && !isAdmin) {
                throw new CustomError('Access Denied. You can only delete plans you have created.', 403);
            }

            await exercisePlanRepository.delete(planId, connection);
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async addExerciseToPlan(requesterUserId, planId, exerciseData) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            await this.updateExercisePlan(requesterUserId, planId, {});

            const newExercise = await plannedExerciseRepository.create({ plan_id: planId, ...exerciseData }, connection);
            
            await connection.commit();
            return newExercise;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async updateExerciseInPlan(requesterUserId, planId, plannedExerciseId, exerciseData) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            await this.updateExercisePlan(requesterUserId, planId, {});

            const existingExercise = await plannedExerciseRepository.findById(plannedExerciseId, connection);
            if (!existingExercise || existingExercise.plan_id !== Number(planId)) {
                throw new CustomError('Planned exercise not found in this plan.', 404);
            }
            
            await plannedExerciseRepository.update(plannedExerciseId, exerciseData, connection);
            await connection.commit();
            
            return await plannedExerciseRepository.findById(plannedExerciseId, connection);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async removeExerciseFromPlan(requesterUserId, planId, plannedExerciseId) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            await this.updateExercisePlan(requesterUserId, planId, {});
            
            const existingExercise = await plannedExerciseRepository.findById(plannedExerciseId, connection);
            if (!existingExercise || existingExercise.plan_id !== Number(planId)) {
                throw new CustomError('Planned exercise not found in this plan.', 404);
            }

            await plannedExerciseRepository.delete(plannedExerciseId, connection);
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};

export default exercisePlanService; 