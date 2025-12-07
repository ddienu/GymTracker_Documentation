import express from 'express';
import clientController from '../controllers/clientController.js';

const router = express.Router();

// Ruta de registro
// POST /api/auth/register
router.get('/getAllClients', clientController.getAllClients);
router.get('/getClientById/:clientId', clientController.getClientByUserId)
router.patch('/:clientId', clientController.updateClientStatus)
router.put('/:clientId', clientController.updateClient);
router.delete('/:clientId', clientController.deleteClient);

// Ruta de inicio de sesión
// POST /api/auth/login
// router.post('/login', authController.login);

export default router; 