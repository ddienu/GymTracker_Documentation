import express from 'express';
import mealPlanController from '../controllers/mealPlanController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// -- Rutas para MealPlan --

router.post('/', mealPlanController.createMealPlan);
router.get('/client/:clientId', mealPlanController.getMealPlansByClient);
router.get('/:planId', mealPlanController.getMealPlanById);
router.put('/:planId', mealPlanController.updateMealPlan);
router.delete('/:planId', mealPlanController.deleteMealPlan);

// -- Rutas para MealPlan_Meal --

router.post('/:planId/meals', mealPlanController.addMealToPlan);
router.put('/:planId/meals/:mealPlanMealId', mealPlanController.updateMealInPlan);
router.delete('/:planId/meals/:mealPlanMealId', mealPlanController.removeMealFromPlan);

export default router; 