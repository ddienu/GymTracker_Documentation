import db from "../config/db.js";

const appointmentCreditsRepository = {

    async createAppointmentCredit(clientId, serviceId, clientOrderId, orderItemId, connection){
        const query = `INSERT INTO appointment_credits (client_id, service_id, client_order_id,  order_item_id) VALUES (?,?,?,?)`;
        const conn = connection || db;
        const [result] = await conn.query(query, [clientId, serviceId, clientOrderId, orderItemId]);
        return result;
    }

}

export default appointmentCreditsRepository;
