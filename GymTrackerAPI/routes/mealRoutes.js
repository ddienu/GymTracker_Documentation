import express from 'express';
import mealController from '../controllers/mealController.js';

const router = express.Router();

// --- Rutas de Comidas ---
// Aquí definiremos las rutas para el CRUD de Meal

router.get('/', mealController.getAllMeals);
router.post('/', mealController.createMeal);
router.get('/:id', mealController.getMealById);
router.put('/:id', mealController.updateMeal);
router.delete('/:id', mealController.deleteMeal);

export default router; 