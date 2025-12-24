import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

// Ruta de registro
// POST /api/auth/register
router.post('/register', authController.register);

// Ruta de inicio de sesión
// POST /api/auth/login
router.post('/login', authController.login);

export default router; 