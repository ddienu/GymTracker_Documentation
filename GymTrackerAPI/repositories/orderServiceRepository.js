import db from '../config/db.js';

const orderServiceRepository = {
    /**
     * Crea un registro de un servicio comprado como parte de una orden.
     * @param {number} orderId - El ID de la orden a la que pertenece este servicio.
     * @param {object} serviceItem - El artículo de servicio del carrito.
     * @param {object} connection - La conexión de la base de datos para la transacción.
     * @returns {Promise<void>}
     */
    async create(orderId, serviceItem, connection) {
        const query = `
            INSERT INTO OrderService (order_id, service_id, price)
            VALUES (?, ?, ?)
        `;
        // serviceItem.service_id viene de la tabla CartService que tiene un join con Service
        const params = [orderId, serviceItem.service_id, serviceItem.price];
        
        const conn = connection || db;
        await conn.query(query, params);
    },

    /**
     * Busca todos los servicios asociados a una orden.
     * @param {number} orderId - El ID de la orden.
     * @param {object} [connection] - Conexión de BD opcional.
     * @returns {Promise<Array>} Un array con los servicios de la orden.
     */
    async findByOrderId(orderId, connection) {
        const query = `
            SELECT os.*, s.name 
            FROM OrderService os
            JOIN Service s ON os.service_id = s.service_id
            WHERE os.order_id = ?
        `;
        const conn = connection || db;
        const [rows] = await conn.query(query, [orderId]);
        return rows;
    },

    /**
     * Cuenta el total de servicios comprados para una orden.
     * @param {number} orderId - El ID de la orden.
     * @param {object} connection - La conexión de BD.
     * @returns {Promise<number>}
     */
    async countByOrderId(orderId, connection) {
        const query = 'SELECT COUNT(*) as total FROM OrderService WHERE order_id = ?';
        const conn = connection || db;
        const [rows] = await conn.query(query, [orderId]);
        return rows[0].total;
    },

    /**
     * Cuenta el total de veces que un cliente ha comprado un servicio específico.
     * @param {number} clientId - El ID del cliente.
     * @param {number} serviceId - El ID del servicio.
     * @param {object} connection - La conexión de BD.
     * @returns {Promise<number>} El número total de veces que se ha comprado el servicio.
     */
    async countPurchasedByClientAndService(clientId, serviceId, connection) {
        const query = `
            SELECT COUNT(os.order_service_id) as total
            FROM OrderService os
            JOIN ClientOrder co ON os.order_id = co.order_id
            WHERE co.client_id = ?
              AND os.service_id = ?
              AND co.order_status IN ('PAID', 'COMPLETED')
        `;
        const conn = connection || db;
        const [rows] = await conn.query(query, [clientId, serviceId]);
        return rows[0].total || 0;
    }
};

export default orderServiceRepository; 