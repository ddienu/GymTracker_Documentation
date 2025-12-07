import express from 'express';
import paymentMethodController from '../controllers/paymentMethodController.js';

const router = express.Router();

// --- Rutas de Métodos de Pago ---
// Aquí definiremos las rutas para el CRUD de PaymentMethod

router.get('/', paymentMethodController.getAllPaymentMethods);
router.post('/', paymentMethodController.createPaymentMethod);
router.get('/:id', paymentMethodController.getPaymentMethodById);
router.put('/:id', paymentMethodController.updatePaymentMethod);
router.delete('/:id', paymentMethodController.deletePaymentMethod);

export default router; 