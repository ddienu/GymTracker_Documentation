import orderService from '../services/orderService.js';

const orderController = {
    async createOrder(req, res, next) {
        try {
            const userId = req.user.id;
            const { paymentMethodId } = req.body;

            if (!paymentMethodId) {
                return res.status(400).json({ success: false, message: 'paymentMethodId is required.' });
            }

            const order = await orderService.createOrderFromCart(userId, paymentMethodId);
            res.status(201).json(order);
        } catch (error) {
            next(error);
        }
    },

    async getOrderHistory(req, res, next) {
        try {
            const userId = req.user.id;
            const orders = await orderService.getOrderHistory(userId);
            res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    },

    async getOrderById(req, res, next) {
        try {
            const userId = req.user.id;
            const { orderId } = req.params;
            const order = await orderService.getOrderById(userId, orderId);
            res.status(200).json(order);
        } catch (error) {
            next(error);
        }
    }
};

export default orderController; 