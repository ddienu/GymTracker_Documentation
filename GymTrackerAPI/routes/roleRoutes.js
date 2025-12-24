import express from 'express';
import roleController from '../controllers/roleController.js';

const router = express.Router();

// --- Rutas de Roles ---
// Aquí definiremos las rutas para el CRUD de Roles (POST, GET, PUT, DELETE)

// GET /api/roles - Obtener todos los roles
router.get('/', roleController.getAllRoles);

// POST /api/roles - Crear un nuevo rol
router.post('/', roleController.createRole);

// GET /api/roles/:id - Obtener un rol por su ID
router.get('/:id', roleController.getRoleById);

// PUT /api/roles/:id - Actualizar un rol por su ID
router.put('/:id', roleController.updateRole);

// DELETE /api/roles/:id - Eliminar un rol por su ID
router.delete('/:id', roleController.deleteRole);

export default router; 