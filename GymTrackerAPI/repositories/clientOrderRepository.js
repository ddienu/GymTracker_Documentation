import db from '../config/db.js';

const clientOrderRepository = {
    async createClientOrder(clientId, totalAmount, connection) {
        const query = `INSERT INTO ClientOrder (client_id, order_date, order_status, total_amount) VALUES (?,?,?,?)`;
        const conn = connection || db;
        const [result] = await conn.query(query, [clientId, new Date(), "COMPLETED", totalAmount]);
        return { clientId: clientId, orderCreatedId: result.insertId };
    },

    async getClientOrderById(clientOrderId, connection){
        const query = `
        SELECT t0.*,
       t1.*,
       p.name        AS product_name,
       p.description AS product_description,
       s.name        AS service_name,
       s.description AS service_description
        FROM   ClientOrder t0
       INNER JOIN OrderItem t1
               ON t0.client_order_id = t1.client_order_id
       LEFT JOIN Product p
              ON t1.item_type = 'PRODUCT'
                 AND t1.item_id = p.product_id
       LEFT JOIN Service s
              ON t1.item_type = 'SERVICE'
                 AND t1.item_id = s.service_id
        WHERE  t0.client_order_id = ?; 
        `;
        const conn = connection || db;
        const [result] = await conn.query(query, clientOrderId);
        return result;
    }
}

export default clientOrderRepository;