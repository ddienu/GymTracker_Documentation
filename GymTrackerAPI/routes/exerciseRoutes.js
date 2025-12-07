import express from 'express';
import exerciseController from '../controllers/exerciseController.js';

const router = express.Router();

// --- Rutas de Ejercicios ---
// Aquí definiremos las rutas para el CRUD de Exercise

router.get('/', exerciseController.getAllExercises);
router.post('/', exerciseController.createExercise);
router.get('/:id', exerciseController.getExerciseById);
router.put('/:id', exerciseController.updateExercise);
router.delete('/:id', exerciseController.deleteExercise);

export default router; 