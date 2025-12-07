import db from '../config/db.js';

const paymentRepository = {
    async create(paymentData, connection) {
        const { clientOrderId, paymentMethodId, amount } = paymentData;
        const query = `
            INSERT INTO Payment (client_order_id, payment_method_id, amount, payment_status)
            VALUES (?, ?, ?, 'COMPLETED')
        `;
        const params = [clientOrderId, paymentMethodId, amount];
        const conn = connection || db;
        const [result] = await conn.query(query, params);
        return result;
    },

    async getPaymentsByClientId(clientId, connection) {
        const query = `
            SELECT t0.*, t1.*, t2.name FROM Payment t0
            INNER JOIN ClientOrder t1 ON t0.client_order_id = t1.client_order_id
            INNER JOIN PaymentMethod t2 ON t0.payment_method_id = t2.payment_method_id
            WHERE t1.client_id = ?
        `;
        const conn = connection || db;
        const [result] = await conn.query(query, [clientId]);
        return result;
    }
};

export default paymentRepository; 