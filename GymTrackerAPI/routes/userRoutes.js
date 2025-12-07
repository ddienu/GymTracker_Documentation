import express from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

// POST /api/users - Crear un nuevo usuario (ruta protegida para administradores)
// El array de middlewares se ejecuta en orden.
router.post(
  '/',
  [authMiddleware, adminMiddleware],
  userController.createUser
);

// GET /api/users/clients - Obtener una lista de todos los clientes (ruta de diagnóstico)
router.get(
  '/clients',
  [authMiddleware, adminMiddleware],
  userController.getAllClients
);

router.put("/reactivate/:userId", userController.reactivateUser);

export default router; 