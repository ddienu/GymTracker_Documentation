import express from 'express';
import profileController from '../controllers/profileController.js';
import clientController from '../controllers/clientController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas en este archivo están prefijadas con /api/me y requieren autenticación.
router.use(authMiddleware);

// Rutas para el perfil del usuario logueado
router.get('/profile', profileController.getProfile);
router.put('/profile', profileController.updateProfile);

// Rutas para los detalles del cliente del usuario logueado
router.get('/client-details', clientController.getClientDetails);
router.put('/client-details', clientController.updateClientDetails);


export default router; 