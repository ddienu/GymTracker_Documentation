import db from "../config/db.js";

const appointmentCreditsRepository = {

    async createAppointmentCredit(clientId, serviceId, clientOrderId, orderItemId, connection){
        const query = `INSERT INTO appointment_credits (client_id, service_id, client_order_id,  order_item_id) VALUES (?,?,?,?)`;
        const conn = connection || db;
        const [result] = await conn.query(query, [clientId, serviceId, clientOrderId, orderItemId]);
        return result;
    },

    async getAppointmentCreditsByClientId(clientId, connection){
        const query = `SELECT * FROM appointment_credits t0
        INNER JOIN Service t1 ON t0.service_id = t1.service_id
        WHERE t0.client_id = ? AND t0.credit_status = 'AVAILABLE'`;
        const conn = connection || db;
        const [result] = await conn.query(query, [clientId]);
        return result;
    }

}

export default appointmentCreditsRepository;
