import pool from "../config/db.js";

class ProfessionalRepository {
  /**
   * Crea un nuevo registro de Profesional a partir de un ID de perfil.
   * @param {object} professionalData - Datos del profesional, debe contener profile_id.
   * @param {object} [connection=pool] - Conexión de BD opcional para transacciones.
   * @returns {Promise<object>} El resultado de la inserción.
   */
  async create(professional, connection = pool) {
    const {
      profile_id,
      specialty,
      certifications,
      years_of_experience,
      hourly_rate,
    } = professional;
    const query =
      "INSERT INTO Professional (profile_id, specialty, certifications, years_of_experience, hourly_rate) VALUES (?, ?, ?, ?, ?)";

    const values = [
      profile_id,
      specialty || null,
      certifications || null,
      years_of_experience || null,
      hourly_rate || null,
    ];
    const conn = connection || pool;
    const [result] = await conn.query(query, values);
    return { professional_id: result.insertId, ...professional };
  }

  async createProfessionalWorkingHours(professionalId, connection = pool) {
    const days = [1, 2, 3, 4, 5]; // Lun–Vie
    const values = days.map((d) => [
      professionalId,
      d,
      "08:00",
      "17:00",
      "America/Bogota",
    ]);

    const sql = `
    INSERT INTO professional_working_hours
      (professional_id, day_of_week, start_time, end_time, timezone)
    VALUES ?
    ON DUPLICATE KEY UPDATE
      start_time = VALUES(start_time),
      end_time   = VALUES(end_time),
      timezone   = VALUES(timezone)
  `;

    const conn = connection || pool;
    const [result] = await conn.query(sql, [values]);
    return result;
  }

  async findByProfileId(profileId, connection) {
    const conn = connection || pool;
    const [rows] = await conn.query(
      "SELECT * FROM Professional WHERE profile_id = ?",
      [profileId]
    );
    return rows[0];
  }

  async findAll() {
    const query = `
      SELECT 
        prof.professional_id, prof.profile_id, prof.specialty, prof.certifications, prof.years_of_experience, prof.hourly_rate, prof.is_available,
        p.first_name, p.last_name, p.email, p.photo_url
      FROM Professional prof
      JOIN Profile p ON prof.profile_id = p.profile_id
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  async findById(id) {
    const query = `
      SELECT 
        prof.professional_id, prof.profile_id, prof.specialty, prof.certifications, prof.years_of_experience, prof.hourly_rate, prof.is_available,
        p.first_name, p.last_name, p.email, p.photo_url
      FROM Professional prof
      JOIN Profile p ON prof.profile_id = p.profile_id
      WHERE prof.professional_id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  async update(id, professional, connection) {
    // Obtenemos los campos y valores del objeto professional
    const fields = Object.keys(professional);
    const values = Object.values(professional);

    if (fields.length === 0) {
      return this.findById(id); // No hay nada que actualizar
    }

    // Construimos la parte SET de la consulta dinámicamente
    const setClause = fields.map((field) => `${field} = ?`).join(", ");

    const query = `UPDATE Professional SET ${setClause} WHERE professional_id = ?`;

    const conn = connection || pool;
    await conn.query(query, [...values, id]);

    return this.findById(id);
  }

  async updateRoleWhenProfessionalDeleted(professionalId, connection) {
    const query = `UPDATE User t1
                   INNER JOIN Profile t2 ON t1.user_id = t2.user_id
                   INNER JOIN Professional t3 ON t2.profile_id = t3.profile_id
                   SET t1.role_id = 1
                   WHERE t3.professional_id = ?;`;

    const conn = connection || pool;
    const [result] = await conn.query(query, [professionalId]);
    return result.affectedRows;
  }

  async findByUserId(userId, connection) {
    const query = `
      SELECT 
        prof.*,
        p.user_id
      FROM Professional AS prof
      JOIN Profile AS p ON prof.profile_id = p.profile_id
      WHERE p.user_id = ?
    `;
    const conn = connection || pool;
    const [rows] = await conn.query(query, [userId]);
    return rows[0] || null;
  }

  async delete(id, connection) {
    const query = "DELETE FROM Professional WHERE professional_id = ?";
    const conn = connection || pool;
    const [result] = await conn.query(query, [id]);
    return result.affectedRows;
  }

  async findAllWithAssignedClients() {
    const query = `
      SELECT 
        prof.professional_id,
        prof.specialty,
        prof.certifications,
        prof.years_of_experience,
        prof.hourly_rate,
        prof.is_available,
        p.first_name as professional_first_name,
        p.last_name as professional_last_name,
        p.email as professional_email,
        COUNT(c.client_id) as assigned_clients_count,
        GROUP_CONCAT(
          CONCAT(cp.first_name, ' ', cp.last_name, ' (', cp.goals, ')')
          SEPARATOR '; '
        ) as clients_info
      FROM Professional prof
      JOIN Profile p ON prof.profile_id = p.profile_id
      LEFT JOIN Client c ON prof.professional_id = c.assigned_professional_id
      LEFT JOIN Profile cp ON c.profile_id = cp.profile_id
      GROUP BY prof.professional_id, p.first_name, p.last_name, p.email
      ORDER BY p.first_name, p.last_name
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  async findRoleByEmail(email) {
    const query = `SELECT T1.email, T3.name FROM Profile T1
      INNER JOIN User T2 ON T1.user_id = T2.user_id
      INNER JOIN Role T3 ON T3.role_id = T2.role_id
      WHERE T1.email = ?`;

    const [rows] = await pool.query(query, [email]);

    return rows[0] || null;
  }

  async updateProfessionalAndProfile(professionalId, professionalData) {
    const query = `UPDATE Professional T1
    INNER JOIN Profile T2 ON T1.profile_id = T2.profile_id
    SET T1.specialty = ?,
      T1.certifications = ?,
      T1.years_of_experience = ?,
      T1.hourly_rate = ?,
      T1.is_available = ?,
      T2.first_name = ?,
      T2.last_name = ?,
      T2.birth_date = ?,
      T2.gender = ?
    WHERE T1.professional_id = ?
    `;

    const values = [
      professionalData.specialty,
      professionalData.certifications,
      professionalData.years_of_experience,
      professionalData.hourly_rate,
      professionalData.is_available,
      professionalData.first_name,
      professionalData.last_name,
      professionalData.birth_date,
      professionalData.gender,
      professionalId,
    ];

    const [result] = await pool.query(query, values);
    return result;
  }

  async getProfessionalAndProfileData(professionalId) {
    const query = `SELECT 
    T1.specialty,
    T1.certifications,
    T1.years_of_experience,
    T1.hourly_rate,
    T1.is_available,
    T2.first_name,
    T2.last_name,
    T2.birth_date,
    T2.gender
FROM Professional T1
INNER JOIN Profile T2 ON T1.profile_id = T2.profile_id
WHERE T1.professional_id = ?;
`;

    const [result] = await pool.query(query, [professionalId]);
    return result[0];
  }

  async getProfessionalAvailabity(professionalId, date) {
    const [workingHours] = await pool.query(
      `SELECT * FROM professional_working_hours
    WHERE professional_id = ?
    AND day_of_week = DAYOFWEEK(?) - 1;`,
      [professionalId, date]
    );

    const [timeOffRows] = await pool.query(
      `SELECT *
     FROM professional_time_off
     WHERE professional_id = ?
       AND DATE(start_time) <= ?
       AND DATE(end_time) >= ?`,
      [professionalId, date, date]
    );
    const [appointmentsRows] = await pool.query(
      `SELECT *
     FROM Appointment
     WHERE professional_id = ?
       AND DATE(start_time) = ?`,
      [professionalId, date]
    );

    return {
      workingHours: workingHours,
      timeOff: timeOffRows,
      appointments: appointmentsRows,
    };
  }

  async getProfessionalAppointments(professionalId,date){
    const query = `SELECT * FROM Appointment t1
      INNER JOIN Client t2 ON t1.client_id = t2.client_id
      INNER JOIN Profile t3 ON t3.profile_id = t2.profile_id
      WHERE t1.professional_id = ?
      AND DATE(t1.start_time) = ?`;
    const [result] = await pool.query(query, [professionalId, date]);
    return result;
  }
}

export default new ProfessionalRepository();
