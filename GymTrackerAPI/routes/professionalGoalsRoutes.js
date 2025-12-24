import express from 'express';
import professionalController from '../controllers/professionalController.js';
import adminController from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas para profesionales - ver goals de clientes
router.get('/my-clients', authMiddleware, professionalController.getAssignedClients);
router.get('/all-clients', authMiddleware, professionalController.getAllClientsWithGoals);
router.get('/client/:clientId/goals', authMiddleware, professionalController.getClientGoals);

// Rutas para administradores - gestión completa de goals
router.get('/admin/clients', authMiddleware, adminController.getAllClientsWithGoals);
router.get('/admin/client/:clientId/goals', authMiddleware, adminController.getClientGoals);
router.get('/admin/professionals', authMiddleware, adminController.getAllProfessionalsWithClients);
router.post('/admin/assign-client', authMiddleware, adminController.assignClientToProfessional);
router.get('/admin/clients/goal/:goalType', authMiddleware, adminController.getClientsByGoal);

export default router;