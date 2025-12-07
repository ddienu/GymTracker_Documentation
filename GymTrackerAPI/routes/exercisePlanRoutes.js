import express from 'express';
import exercisePlanController from '../controllers/exercisePlanController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Middleware de autenticación para todas las rutas de planes
router.use(authMiddleware);

// -- Rutas para ExercisePlan --

// Crear un nuevo plan de ejercicios para un cliente
// Solo un profesional puede hacer esto.
router.post('/', exercisePlanController.createExercisePlan);

// Obtener todos los planes de ejercicios de un cliente específico
// El cliente puede ver sus propios planes, un profesional puede ver los de sus clientes.
router.get('/client/:clientId', exercisePlanController.getExercisePlansByClient);

// Obtener un plan de ejercicios específico por su ID
router.get('/:planId', exercisePlanController.getExercisePlanById);

// Actualizar la información general de un plan de ejercicios
router.put('/:planId', exercisePlanController.updateExercisePlan);

// Eliminar un plan de ejercicios
router.delete('/:planId', exercisePlanController.deleteExercisePlan);


// -- Rutas para PlannedExercise (ejercicios dentro de un plan) --

// Añadir un ejercicio a un plan existente
router.post('/:planId/exercises', exercisePlanController.addExerciseToPlan);

// Actualizar un ejercicio específico dentro de un plan
router.put('/:planId/exercises/:plannedExerciseId', exercisePlanController.updateExerciseInPlan);

// Eliminar un ejercicio de un plan
router.delete('/:planId/exercises/:plannedExerciseId', exercisePlanController.removeExerciseFromPlan);


export default router; 