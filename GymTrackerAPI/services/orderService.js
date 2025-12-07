import CustomError from '../utils/CustomError.js';
import db from '../config/db.js';
import clientRepository from '../repositories/clientRepository.js';
import cartRepository from '../repositories/cartRepository.js';
import productRepository from '../repositories/productRepository.js';
import cartProductRepository from '../repositories/cartProductRepository.js';
import cartServiceRepository from '../repositories/cartServiceRepository.js';
import orderRepository from '../repositories/orderRepository.js';
import orderProductRepository from '../repositories/orderProductRepository.js';
import orderServiceRepository from '../repositories/orderServiceRepository.js';
import paymentRepository from '../repositories/paymentRepository.js';

const orderService = {
    async createOrderFromCart(userId, paymentMethodId) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Validar cliente y obtener su carrito
            const client = await clientRepository.findByUserId(userId, connection);
            if (!client) throw new CustomError('Client profile not found.', 404);

            const cart = await cartRepository.findByClientId(client.client_id, connection);
            if (!cart) throw new CustomError('Cart not found.', 404);

            const cartProducts = await cartProductRepository.findByCartId(cart.cart_id, connection);
            const cartServices = await cartServiceRepository.findByCartId(cart.cart_id, connection);

            if (cartProducts.length === 0 && cartServices.length === 0) {
                throw new CustomError('Cannot create an order from an empty cart.', 400);
            }

            // 2. Verificar stock ANTES de hacer cualquier otra cosa
            for (const item of cartProducts) {
                const product = await productRepository.findById(item.product_id, connection);
                if (product.stock < item.quantity) {
                    throw new CustomError(`Not enough stock for product: ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`, 409);
                }
            }

            // 3. Calcular el monto total
            const totalProducts = cartProducts.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
            const totalServices = cartServices.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const totalAmount = totalProducts + totalServices;

            // 4. Crear la orden principal
            const orderData = {
                client_id: client.client_id,
                order_status: 'PAID', // O 'PROCESSING', dependiendo del flujo de pago
                total_amount: totalAmount,
            };
            const orderResult = await orderRepository.create(orderData, connection);
            const orderId = orderResult.order_id;

            // 4a. Crear el registro de pago
            await paymentRepository.create({
                orderId: orderId,
                paymentMethodId: paymentMethodId,
                amount: totalAmount
            }, connection);

            // 5. Mover artículos y actualizar stock de forma atómica
            for (const item of cartProducts) {
                await orderProductRepository.create(orderId, item, connection);
                const updateResult = await productRepository.decreaseStock(item.product_id, item.quantity, connection);
                
                // Si ninguna fila fue afectada, significa que no había stock suficiente.
                // Esta es una doble verificación de seguridad.
                if (updateResult.affectedRows === 0) {
                    throw new CustomError(`Failed to update stock for product ID: ${item.product_id}. The product may be out of stock.`, 409);
                }
            }

            for (const item of cartServices) {
                // Insertar una fila en OrderService por cada unidad de cantidad
                for (let i = 0; i < item.quantity; i++) {
                    await orderServiceRepository.create(orderId, item, connection);
                }
            }

            // 6. Limpiar el carrito
            await cartProductRepository.clearByCartId(cart.cart_id, connection);
            await cartServiceRepository.clearByCartId(cart.cart_id, connection);

            await connection.commit();

            // Construir el objeto de respuesta final
            const finalOrder = await orderRepository.findById(orderId, connection);
            finalOrder.products = await orderProductRepository.findByOrderId(orderId, connection);
            finalOrder.services = await orderServiceRepository.findByOrderId(orderId, connection);

            return finalOrder;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async getOrderHistory(userId) {
        const connection = await db.getConnection();
        try {
            const client = await clientRepository.findByUserId(userId, connection);
            if (!client) {
                throw new CustomError('Client profile not found.', 404);
            }
            
            const orders = await orderRepository.findByClientId(client.client_id, connection);
            
            // Para cada orden, obtener sus productos y servicios
            for (const order of orders) {
                order.products = await orderProductRepository.findByOrderId(order.order_id, connection);
                order.services = await orderServiceRepository.findByOrderId(order.order_id, connection);
            }
            
            return orders;
        } finally {
            connection.release();
        }
    },

    async getOrderById(userId, orderId) {
        const connection = await db.getConnection();
        try {
            const client = await clientRepository.findByUserId(userId, connection);
            if (!client) {
                throw new CustomError('Client profile not found.', 404);
            }

            const order = await orderRepository.findById(orderId, connection);
            if (!order || order.client_id !== client.client_id) {
                throw new CustomError('Order not found or you do not have permission to view it.', 404);
            }

            order.products = await orderProductRepository.findByOrderId(orderId, connection);
            order.services = await orderServiceRepository.findByOrderId(orderId, connection);
            
            return order;
        } finally {
            connection.release();
        }
    }
};

export default orderService; 