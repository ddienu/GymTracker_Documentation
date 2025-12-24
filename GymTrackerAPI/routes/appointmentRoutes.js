import express from 'express';
import appointmentController from '../controllers/appointmentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Todas las rutas en este archivo requieren autenticación
// router.use(authMiddleware);

// Ruta para que un cliente cree una nueva cita (reserve un bloque)
// POST /api/appointments
router.post('/', appointmentController.createAppointment);

// Ruta para que un cliente cancele una de sus citas
// PATCH /api/appointments/:id/cancel
router.patch('/:id/cancel', appointmentController.cancelAppointmentAsClient);

//Ruta para cancelar una cita
router.patch('/cancel/:appointmentId', appointmentController.cancelAppointment);

// Ruta para que un cliente vea sus propias citas
// GET /api/appointments/me
router.get('/me', appointmentController.getAppointmentsForClient);

// Ruta para que un profesional cancele una de sus citas
// PATCH /api/appointments/professional/:id/cancel
router.patch('/professional/:id/cancel', appointmentController.cancelAppointmentAsProfessional);

// Ruta para que un profesional vea sus citas agendadas
// GET /api/appointments/professional/me
router.get('/professional/me', appointmentController.getAppointmentsForProfessional);

// Nueva ruta para que un profesional marque una cita como completada
router.patch('/:id/complete', appointmentController.completeAppointment);

// ========== RUTAS ADMINISTRATIVAS ==========
// Requieren permisos de administrador

// Ruta para que un administrador vea todas las citas del sistema
// GET /api/appointments
router.get('/', adminMiddleware, appointmentController.getAllAppointments);

// Ruta para que un administrador vea una cita específica por ID
// GET /api/appointments/:id
router.get('/:id', adminMiddleware, appointmentController.getAppointmentById);

// Ruta para que un administrador actualice una cita
// PUT /api/appointments/:id
router.put('/:appointmentId', appointmentController.updateAppointment);

// Ruta para que un administrador elimine una cita
// DELETE /api/appointments/:id
router.delete('/:id', adminMiddleware, appointmentController.deleteAppointment);

export default router; 