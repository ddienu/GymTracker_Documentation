import express from 'express';
import availabilityController from '../controllers/availabilityController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas en este archivo requieren autenticación
router.use(authMiddleware);

// Ruta para que un profesional añada un nuevo bloque de disponibilidad
// POST /api/availability
router.post('/', availabilityController.addAvailability);

// Ruta para que un profesional vea todos sus bloques de disponibilidad
// GET /api/availability
router.get('/', availabilityController.getMyAvailability);

// Ruta para que un profesional elimine un bloque de disponibilidad
// DELETE /api/availability/:id
router.delete('/:id', availabilityController.deleteAvailability);

export default router; 