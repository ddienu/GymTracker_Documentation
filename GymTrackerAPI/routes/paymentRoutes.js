import express from 'express';
import paymentController from '../controllers/paymentController.js';

const router = express.Router();

// --- Rutas de Métodos de Pago ---
// Aquí definiremos las rutas para el CRUD de PaymentMethod

router.get('/:profileId', paymentController.getPayments);


export default router; 