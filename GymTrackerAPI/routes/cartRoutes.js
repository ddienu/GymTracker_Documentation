import express from 'express';
import cartController from '../controllers/cartController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas del carrito requieren autenticación
// router.use(authMiddleware);

// Obtener el contenido del carrito del usuario
router.get('/:clientId', cartController.getCart);

// Añadir un producto o un servicio al carrito
router.post('/:clientId', cartController.addItemToCart);

// Actualizar la cantidad de un producto en el carrito
router.put('/:clientId', cartController.updateQuantityInCart);

//Eliminar un item del carrito, puede ser tanto servicios como productos
router.delete("/item_remove/:clientId", cartController.removeItemFromCart);

// Eliminar un producto del carrito
// router.delete('/:clientId', cartController.removeProductFromCart);

// Actualizar cantidad de un servicio en el carrito
router.put('/services/:serviceId', cartController.updateServiceQuantityInCart);

// Eliminar un servicio del carrito
router.delete('/services/:serviceId', cartController.removeServiceFromCart);

// Limpiar todo el carrito
router.delete('/:clientId', cartController.clearCart);

export default router; 