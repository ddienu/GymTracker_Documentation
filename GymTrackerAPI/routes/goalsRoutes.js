import express from 'express';
import goalsController from '../controllers/goalsController.js';

const router = express.Router();

// GET /api/goals - Obtener todas las opciones de goals
router.get('/', goalsController.getGoalsOptions);

// GET /api/goals/validate/:goal - Validar un goal específico
router.get('/validate/:goal', goalsController.validateGoal);

export default router;