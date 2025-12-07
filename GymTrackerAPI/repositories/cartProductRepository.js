import db from '../config/db.js';

const cartProductRepository = {
    async findByCartId(cartId, connection) {
        const query = `
            SELECT cp.cart_id, cp.product_id as item_id, p.name, cp.quantity, p.price, p.image_url 
            FROM CartProduct cp
            JOIN Product p ON cp.product_id = p.product_id
            WHERE cp.cart_id = ?
        `;
        const conn = connection || db;
        const [rows] = await conn.query(query, [cartId]);
        return rows;
    },

    async findByCartAndProductId(cartId, productId, connection) {
        const query = 'SELECT * FROM CartProduct WHERE cart_id = ? AND product_id = ?';
        const conn = connection || db;
        const [rows] = await conn.query(query, [cartId, productId]);
        return rows[0];
    },

    async add(cartId, productId, quantity, unitPrice, connection) {
        const query = 'INSERT INTO CartProduct (cart_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)';
        const params = [cartId, productId, quantity, unitPrice];
        const conn = connection || db;
        const [result] = await conn.query(query, params);
        return { id: result.insertId };
    },

    async updateQuantity(cartProductId, quantity, connection) {
        const query = 'UPDATE CartProduct SET quantity = ? WHERE cart_product_id = ?';
        const conn = connection || db;
        const [result] = await conn.query(query, [quantity, cartProductId]);
        return result.affectedRows;
    },

    async remove(id, connection) {
        const query = 'DELETE FROM CartProduct WHERE cart_product_id = ?';
        const conn = connection || db;
        await conn.query(query, [id]);
    },

    async clearByCartId(cartId, connection) {
        const query = 'DELETE FROM CartProduct WHERE cart_id = ?';
        const conn = connection || db;
        await conn.query(query, [cartId]);
    }
};

export default cartProductRepository; 