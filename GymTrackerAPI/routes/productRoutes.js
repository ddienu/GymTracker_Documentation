import express from 'express';
import productController from '../controllers/productController.js';

const router = express.Router();

// Aquí definiremos las rutas para los productos.
// Por ejemplo:
// router.post('/', productController.createProduct);
// router.get('/', productController.getAllProducts);
// router.get('/:id', productController.getProductById);
// router.put('/:id', productController.updateProduct);
// router.delete('/:id', productController.deleteProduct);

// Conectamos la ruta POST /api/productos con el método del controlador.
router.post('/', productController.createProduct);

// GET /api/productos - Obtener todos los productos
router.get('/', productController.getAllProducts);

// GET /api/productos/:id - Obtener un producto por su ID
router.get('/:id', productController.getProductById);

// PUT /api/productos/:id - Actualizar un producto existente
router.put('/:id', productController.updateProduct);

// DELETE /api/productos/:id - Eliminar un producto
router.delete('/:id', productController.deleteProduct);

// Dejaremos las otras rutas listas para ser implementadas.
// router.delete('/:id', productController.deleteProduct);

export default router; 