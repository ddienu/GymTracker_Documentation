import db from '../config/db.js';

const orderProductRepository = {
    async create(orderId, product, connection) {
        const query = `
            INSERT INTO OrderProduct (order_id, product_id, quantity, unit_price)
            VALUES (?, ?, ?, ?)
        `;
        const params = [orderId, product.product_id, product.quantity, product.unit_price];
        const conn = connection || db;
        await conn.query(query, params);
    },

    async findByOrderId(orderId, connection) {
        const query = `
            SELECT op.*, p.name, p.image_url 
            FROM OrderProduct op
            JOIN Product p ON op.product_id = p.product_id
            WHERE op.order_id = ?
        `;
        const conn = connection || db;
        const [rows] = await conn.query(query, [orderId]);
        return rows;
    },

    async countTotalPurchasedByClient(clientId, productId, connection) {
        const query = `
            SELECT SUM(op.quantity) AS total_purchased
            FROM OrderProduct op
            JOIN \`Order\` o ON op.order_id = o.order_id
            WHERE o.client_id = ? AND op.product_id = ?
        `;
        const params = [clientId, productId];
        const conn = connection || db;
        const [rows] = await conn.query(query, params);
        return rows[0]?.total_purchased || 0;
    }
};

export default orderProductRepository; 