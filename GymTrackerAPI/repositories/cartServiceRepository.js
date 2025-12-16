import db from '../config/db.js';

const cartServiceRepository = {
    async findByCartAndService(cartId, serviceId, connection) {
        const query = 'SELECT * FROM CartService WHERE cart_id = ? AND service_id = ?';
        const conn = connection || db;
        const [rows] = await conn.query(query, [cartId, serviceId]);
        return rows[0];
    },

    async add(cartId, serviceId, quantity, price, connection) {
        const query = 'INSERT INTO CartService (cart_id, service_id, quantity, price) VALUES (?, ?, ?, ?)';
        const params = [cartId, serviceId, quantity, price];
        const conn = connection || db;
        const [result] = await conn.query(query, params);
        console.log(result);
        return result.insertId;
    },

    async updateQuantity(id, quantity, connection) {
        const query = 'UPDATE CartService SET quantity = ? WHERE cart_service_id = ?';
        const conn = connection || db;
        await conn.query(query, [quantity, id]);
    },

    async findByCartId(cartId, connection) {
        const query = `
            SELECT cs.cart_id, cs.service_id as item_id, s.name, cs.quantity, s.price, s.description, s.requires_appointment 
            FROM CartService cs
            INNER JOIN Service s ON cs.service_id = s.service_id
            WHERE cs.cart_id = ?
        `;
        const conn = connection || db;
        const [rows] = await conn.query(query, [cartId]);
        return rows;
    },

    async remove(id, connection) {
        const query = 'DELETE FROM CartService WHERE cart_service_id = ?';
        const conn = connection || db;
        await conn.query(query, [id]);
    },

    async clearByCartId(cartId, connection) {
        const query = 'DELETE FROM CartService WHERE cart_id = ?';
        const conn = connection || db;
        await conn.query(query, [cartId]);
    }
};

export default cartServiceRepository; 