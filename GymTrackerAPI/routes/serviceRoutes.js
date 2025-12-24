import express from 'express';
import serviceController from '../controllers/serviceController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

// --- Rutas de Servicios ---
// Aquí definiremos las rutas para el CRUD de Servicios (POST, GET, PUT, DELETE)

// Las rutas para OBTENER servicios están protegidas por autenticación general.
// Cualquier usuario logueado (cliente, profesional) puede ver los servicios.
router.get('/', serviceController.getAllServices);
router.get('/:id', authMiddleware, serviceController.getServiceById);

// Las rutas para CREAR, ACTUALIZAR y ELIMINAR servicios
// requieren que el usuario sea un ADMINISTRADOR.
router.post('/', authMiddleware, adminMiddleware, serviceController.createService);
router.put('/:id', authMiddleware, adminMiddleware, serviceController.updateService);
router.patch('/:serviceId', authMiddleware, adminMiddleware, serviceController.deactivateService);
router.delete('/:id', authMiddleware, adminMiddleware, serviceController.deleteService);

export default router; 