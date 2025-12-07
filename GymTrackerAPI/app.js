import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import paymentMethodRoutes from './routes/paymentMethodRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';
import mealRoutes from './routes/mealRoutes.js';
import authRoutes from './routes/authRoutes.js';
import meRoutes from './routes/meRoutes.js';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import professionalRoutes from './routes/professionalRoutes.js';
import availabilityRoutes from './routes/availabilityRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import exercisePlanRoutes from './routes/exercisePlanRoutes.js';
import mealPlanRoutes from './routes/mealPlanRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import clientRoutes from './routes/clientRoutes.js'
import clientOrderRoutes from './routes/clientOrderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'
import cors from 'cors';


// Cargar variables de entorno
dotenv.config();

// Crear la instancia de la aplicación Express
const app = express();

// Middleware para parsear el cuerpo de las solicitudes como JSON.
// Es crucial para que `req.body` funcione en nuestras rutas POST y PUT.
app.use(cors());
app.use(express.json());

// Rutas de la API
// Todas las rutas definidas en `productRoutes` estarán prefijadas con `/api/products`.
app.use('/api/products', productRoutes);

// Todas las rutas definidas en `roleRoutes` estarán prefijadas con `/api/roles`.
app.use('/api/roles', roleRoutes);

// Todas las rutas definidas en `paymentMethodRoutes` estarán prefijadas con `/api/payment-methods`.
app.use('/api/payment-methods', paymentMethodRoutes);

// Todas las rutas definidas en `exerciseRoutes` estarán prefijadas con `/api/exercises`.
app.use('/api/exercises', exerciseRoutes);

// Todas las rutas definidas en `serviceRoutes` estarán prefijadas con `/api/services`.
app.use('/api/services', serviceRoutes);

// Todas las rutas definidas en `mealRoutes` estarán prefijadas con `/api/meals`.
app.use('/api/meals', mealRoutes);

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas para el usuario autenticado
app.use('/api/me', meRoutes);

// Rutas para la gestión de usuarios
app.use('/api/users', userRoutes);

// Rutas para la gestión de profesionales
app.use('/api/professionals', professionalRoutes);

// Rutas para la gestión de disponibilidad
app.use('/api/availability', availabilityRoutes);

// Rutas para la gestión de citas
app.use('/api/appointments', appointmentRoutes);

// Rutas para la gestión de planes de ejercicios
app.use('/api/exercise-plans', exercisePlanRoutes);

// Rutas para la gestión de planes de comidas
app.use('/api/meal-plans', mealPlanRoutes);

// Rutas para la gestión del carrito de compras
app.use('/api/cart', cartRoutes);

// Rutas para la gestión de órdenes
app.use('/api/orders', orderRoutes);

app.use('/api/clients', clientRoutes)

app.use('/api/client_order', clientOrderRoutes)

app.use('/api/payments', paymentRoutes)

// Middleware de Manejo de Errores
// Debe ser el último middleware que se añade a la aplicación.
// Capturará cualquier error que se pase a `next()` en los controladores.
app.use(errorHandler);

export default app;
