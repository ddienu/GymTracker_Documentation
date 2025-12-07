import db from '../config/db.js';

const orderItemRepository = {
    async createOrderItems(clientOrderId, itemType, itemId, quantity, unitPrice, connection) {
        const query = `
            INSERT INTO OrderItem(client_order_id, item_type, item_id, quantity, unit_price) VALUES (?,?,?,?,?)
        `;
        const params = [clientOrderId, itemType, itemId, quantity, unitPrice];
        const conn = connection || db;
        const [rows] = await conn.query(query, params);
        return rows;
    },

};

export default orderItemRepository; 