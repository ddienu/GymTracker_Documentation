import express from 'express';
import orderController from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Crear una nueva orden a partir del carrito del usuario
router.post('/', orderController.createOrder);

// Obtener el historial de órdenes del usuario
router.get('/', orderController.getOrderHistory);

// Obtener los detalles de una orden específica
router.get('/:orderId', orderController.getOrderById);

export default router; 