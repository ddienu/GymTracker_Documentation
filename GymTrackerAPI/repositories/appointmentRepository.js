import db from "../config/db.js";

const appointmentRepository = {
  async create(appointment, connection) {
    const query = `
            INSERT INTO Appointment (client_id, professional_id, availability_id, service_id, status)
            VALUES (?, ?, ?, ?, ?)
        `;
    const params = [
      appointment.client_id,
      appointment.professional_id,
      appointment.availability_id,
      appointment.service_id,
      appointment.status,
    ];
    const conn = connection || db;
    const [result] = await conn.query(query, params);
    return result;
  },

  async findById(id, connection) {
    const query = "SELECT * FROM Appointment WHERE appointment_id = ?";
    const conn = connection || db;
    const [rows] = await conn.query(query, [id]);
    return rows[0];
  },

  async update(id, fields, connection) {
    const setClauses = Object.keys(fields)
      .map((key) => `${key} = ?`)
      .join(", ");
    if (setClauses.length === 0) {
      return 0;
    }
    const query = `UPDATE Appointment SET ${setClauses} WHERE appointment_id = ?`;
    const params = [...Object.values(fields), id];

    const conn = connection || db;
    const [result] = await conn.query(query, params);
    return result.affectedRows;
  },

  async findAppointmentsByClientId(clientId) {
    const query = `
            SELECT 
                a.appointment_id,
                a.status,
                pa.start_time,
                pa.end_time,
                s.name AS service_name,
                s.price AS service_price,
                p.first_name AS professional_first_name,
                p.last_name AS professional_last_name,
                prof.specialty AS professional_specialty
            FROM Appointment a
            JOIN ProfessionalAvailability pa ON a.availability_id = pa.availability_id
            JOIN Service s ON a.service_id = s.service_id
            JOIN Professional prof ON a.professional_id = prof.professional_id
            JOIN Profile p ON prof.profile_id = p.profile_id
            WHERE a.client_id = ?
            ORDER BY pa.start_time DESC
        `;
    const [rows] = await db.query(query, [clientId]);
    return rows;
  },

  async findAppointmentsByProfessionalId(professionalId) {
    const query = `
            SELECT 
                a.appointment_id,
                a.status,
                pa.start_time,
                pa.end_time,
                s.name AS service_name,
                p.first_name AS client_first_name,
                p.last_name AS client_last_name,
                p.email AS client_email
            FROM Appointment a
            JOIN ProfessionalAvailability pa ON a.availability_id = pa.availability_id
            JOIN Service s ON a.service_id = s.service_id
            JOIN Client c ON a.client_id = c.client_id
            JOIN Profile p ON c.profile_id = p.profile_id
            WHERE a.professional_id = ?
            ORDER BY pa.start_time DESC
        `;
    const [rows] = await db.query(query, [professionalId]);
    return rows;
  },

  /**
   * Cuenta las citas usadas (no canceladas) por un cliente para un servicio específico.
   * @param {number} clientId - El ID del cliente.
   * @param {number} serviceId - El ID del servicio.
   * @param {object} connection - La conexión de BD.
   * @returns {Promise<number>} El número de citas usadas.
   */
  async countUsedByClientAndService(clientId, serviceId, connection) {
    const query = `
            SELECT COUNT(*) AS count
            FROM Appointment
            WHERE client_id = ? 
              AND service_id = ?
              AND status IN ('SCHEDULED', 'COMPLETED', 'NO_SHOW')
        `;
    const params = [clientId, serviceId];
    const conn = connection || db;
    const [rows] = await conn.query(query, params);
    return rows[0]?.count || 0;
  },

  async findAll() {
    const query = `
            SELECT 
                a.appointment_id,
                a.status,
                pa.start_time,
                pa.end_time,
                s.name AS service_name,
                s.price AS service_price,
                cp.first_name AS client_first_name,
                cp.last_name AS client_last_name,
                cp.email AS client_email,
                pp.first_name AS professional_first_name,
                pp.last_name AS professional_last_name,
                prof.specialty AS professional_specialty
            FROM Appointment a
            JOIN ProfessionalAvailability pa ON a.availability_id = pa.availability_id
            JOIN Service s ON a.service_id = s.service_id
            JOIN Client c ON a.client_id = c.client_id
            JOIN Profile cp ON c.profile_id = cp.profile_id
            JOIN Professional prof ON a.professional_id = prof.professional_id
            JOIN Profile pp ON prof.profile_id = pp.profile_id
            ORDER BY pa.start_time DESC
        `;
    const [rows] = await db.query(query);
    return rows;
  },

  async delete(appointmentId, connection) {
    const query = "DELETE FROM Appointment WHERE appointment_id = ?";
    const conn = connection || db;
    const [result] = await conn.query(query, [appointmentId]);
    return result;
  },

  async cancelAppointmentByAdmin(appointmentId, connection) {
    const query = `UPDATE Appointment
    SET status = 'CANCELLED',
    cancelled_at = NOW(),
    cancelled_by = 'admin',
    cancel_reason = 'Cancelado por administrador',
    updated_at = NOW()
    WHERE appointment_id = ?;
    `;
    const conn = connection || db;
    const [result] = await conn.query(query, [appointmentId]);
    return result;
  },
};

export default appointmentRepository;
