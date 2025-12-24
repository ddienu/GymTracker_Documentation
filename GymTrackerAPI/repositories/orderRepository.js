import db from '../config/db.js';

const orderRepository = {
    async create(orderData, connection) {
        const { client_id, total_amount, shipping_address, order_status } = orderData;
        const query = `
            INSERT INTO ClientOrder (client_id, order_status, total_amount, shipping_address)
            VALUES (?, ?, ?, ?)
        `;
        const params = [client_id, order_status, total_amount, shipping_address];
        const conn = connection || db;
        const [result] = await conn.query(query, params);
        return { order_id: result.insertId };
    },

    async findById(orderId, connection) {
        const query = 'SELECT * FROM ClientOrder WHERE order_id = ?';
        const conn = connection || db;
        const [rows] = await conn.query(query, [orderId]);
        return rows[0];
    },

    async findByClientId(clientId, connection) {
        const query = 'SELECT * FROM ClientOrder WHERE client_id = ? ORDER BY order_date DESC';
        const conn = connection || db;
        const [rows] = await conn.query(query, [clientId]);
        return rows;
    }
};

export default orderRepository; 