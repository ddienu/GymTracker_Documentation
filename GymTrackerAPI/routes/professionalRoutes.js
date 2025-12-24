import express from 'express';
import professionalController from '../controllers/professionalController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas aquí requieren que el usuario esté autenticado
// router.use(authMiddleware);

// Ruta para crear un perfil de profesional
// El usuario debe estar logueado y tener el rol 'PROFESSIONAL'

router.post('/email', professionalController.createProfessionalByEmail);
// POST /api/professionals
router.post('/', professionalController.createProfessionalProfile);

// Ruta para obtener todos los perfiles de profesionales
// GET /api/professionals
router.get('/', professionalController.getAllProfessionals);

// Ruta para obtener un perfil de profesional por su ID
// GET /api/professionals/:id
router.get('/:id', professionalController.getProfessionalById);

//Ruta para obtener un perfil con base al email
router.get('/email/:email', professionalController.getProfessionalByEmail);
//Ruta para obtener el rol de un usuario por email
router.get('/role/:email', professionalController.getRoleByProfileEmail);
// Ruta para actualizar un perfil de profesional
// // PUT /api/professionals/:id
// router.put('/:id', professionalController.updateProfessionalProfile);

//Ruta para actualizar un profesional y su perfil
router.put('/:professionalId', professionalController.updateProfessionalAndProfile);

// Ruta para eliminar un perfil de profesional
// DELETE /api/professionals/:id
router.delete('/:professionalId', professionalController.deleteProfessionalProfile);

// Ruta para que un cliente vea la disponibilidad de un profesional específico
// GET /api/professionals/:id/availability
router.get('/:id/availability', professionalController.getProfessionalAvailability);

//Ruta para obtener las citas agendadas de un profesional
router.get('/appointments/:professionalId', professionalController.getProfessionalAppointments);

//Ruta para obtener la información del profesional y su perfil para edición
router.get('/edit/:professionalId', professionalController.getProfessionalAndProfileData);

export default router; 