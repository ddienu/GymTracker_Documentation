import db from '../config/db.js';

class ClientRepository {
  /**
   * Crea un nuevo registro de Cliente a partir de un ID de perfil.
   * @param {object} clientData - Datos del cliente, debe contener profile_id.
   * @param {object} [connection=db] - Conexión de BD opcional para transacciones.
   * @returns {Promise<object>} El resultado de la inserción.
   */
  async create(client, connection = db) {
    const { profile_id, goals, experience_level } = client;
    const query = 'INSERT INTO Client (profile_id, goals, experience_level) VALUES (?, ?, ?)';

    // Asignamos valores por defecto si no se proporcionan
    const values = [
      profile_id,
      goals || null,
      experience_level || null
    ];

    const conn = connection || db;
    const [result] = await conn.execute(query, values);
    return { client_id: result.insertId, ...client };
  }

  /**
   * Busca un cliente por su ID de perfil.
   * @param {number} profileId - El ID del perfil.
   * @returns {Promise<object|null>} El cliente encontrado o null.
   */
  async findByProfileId(profileId) {
    const [rows] = await db.execute('SELECT * FROM Client WHERE profile_id = ?', [profileId]);
    return rows[0] || null;
  }

  /**
   * Actualiza los datos de un cliente por su ID.
   * @param {number} clientId - El ID del cliente.
   * @param {object} clientData - Los datos a actualizar.
   * @returns {Promise<object>} El cliente actualizado.
   */
  async update(clientId, clientData) {
    const fieldsToUpdate = Object.keys(clientData)
      .filter(key => clientData[key] !== undefined)
      .map(key => `${key} = ?`);

    if (fieldsToUpdate.length === 0) {
      return this.findById(clientId); // No hay nada que actualizar
    }

    const values = Object.values(clientData).filter(value => value !== undefined);
    values.push(clientId);

    const sql = `UPDATE Client SET ${fieldsToUpdate.join(', ')} WHERE client_id = ?`;

    await db.execute(sql, values);
    return this.findById(clientId);
  }

  /**
   * Busca un cliente por su ID primario.
   * @param {number} clientId - El ID del cliente.
   * @returns {Promise<object|null>} El cliente encontrado o null.
   */
  async findById(clientId, connection) {
    const query = 'SELECT * FROM Client WHERE client_id = ?';
    const conn = connection || db;
    const [rows] = await conn.execute(query, [clientId]);
    return rows[0] || null;
  }

  async findByUserId(userId, connection) {
    const query = `
      SELECT c.* 
      FROM client c
      JOIN profile p ON c.profile_id = p.profile_id
      WHERE p.user_id = ?
    `;
    const conn = connection || db;
    const [rows] = await conn.query(query, [userId]);
    return rows[0] || null;
  }

  async findAll(connection) {
    const query = 'SELECT c.client_id, c.goals, p.document_number, p.first_name, p.last_name, p.email, u.user_status FROM Client c JOIN Profile p ON c.profile_id = p.profile_id INNER JOIN User u ON u.user_id = p.user_id WHERE role_id = 1';
    const conn = connection || db;
    const [rows] = await conn.query(query);
    return rows;
  }

  async findClientByUserId(userId, connection) {
    const query = 'SELECT u.user_id,u.username, u.password_hash, p.birth_date,c.client_id, c.goals, p.document_number, p.first_name, p.last_name, p.email, u.user_status, p.registration_date, p.gender FROM Client c JOIN Profile p ON c.profile_id = p.profile_id INNER JOIN User u ON u.user_id = p.user_id WHERE c.client_id = ?';
    const conn = connection || db;
    const [rows] = await conn.query(query, [userId]);
    return rows[0] || null;
  }

  async delete(clientId, connection) {
    console.log(clientId);
    const query = "DELETE FROM Client WHERE client_id = ?";
    const conn = connection || db;
    const [result] = await conn.query(query, [clientId]);
    return result;
  }

  async updateClientStatus(clientId, connection) {
    const query = "UPDATE User u INNER JOIN Profile P ON P.user_id = u.user_id INNER JOIN Client C ON C.profile_id = P.profile_id SET u.user_status = 'INACTIVE' WHERE C.client_id = ?";
    const conn = connection || db;
    const [rows] = await conn.query(query, [clientId]);
    return rows || null;
  }

  async updateClient(clientId, clientData, connection) {
    const values = [
      clientData.username,
      clientData.password_hash,
      clientData.document_number,
      clientData.first_name,
      clientData.last_name,
      clientData.email,
      clientData.birth_date,
      clientData.gender,
      clientId
    ];
    const sql = `UPDATE Client c INNER JOIN Profile p ON c.profile_id = p.profile_id INNER JOIN User u ON u.user_id = p.user_id SET u.username = ?, u.password_hash = ?, p.document_number = ?, p.first_name = ?, p.last_name = ?, p.email = ?, p.birth_date = ?, p.gender = ? WHERE c.client_id = ?;`;
    const conn = connection || db;
    const [result] = await conn.query(sql, values);
    return result;
  }

  async findByAssignedProfessional(professionalId, connection) {
    const query = `
      SELECT 
        c.client_id,
        c.goals as client_goals,
        c.experience_level,
        p.first_name,
        p.last_name,
        p.email,
        p.goals as profile_goals,
        p.weight_kg,
        p.height_cm,
        p.birth_date,
        p.gender,
        u.username,
        u.user_status
      FROM Client c
      JOIN Profile p ON c.profile_id = p.profile_id
      JOIN User u ON p.user_id = u.user_id
      WHERE c.assigned_professional_id = ?
      ORDER BY p.first_name, p.last_name
    `;
    const conn = connection || db;
    const [rows] = await conn.query(query, [professionalId]);
    return rows;
  }

  async findAllWithGoals(connection) {
    const query = `
      SELECT 
        c.client_id,
        c.goals as client_goals,
        c.experience_level,
        c.assigned_professional_id,
        p.first_name,
        p.last_name,
        p.email,
        p.goals as profile_goals,
        p.weight_kg,
        p.height_cm,
        p.birth_date,
        p.gender,
        p.registration_date,
        u.username,
        u.user_status,
        prof.professional_id,
        prof_profile.first_name as professional_first_name,
        prof_profile.last_name as professional_last_name
      FROM Client c
      JOIN Profile p ON c.profile_id = p.profile_id
      JOIN User u ON p.user_id = u.user_id
      LEFT JOIN Professional prof ON c.assigned_professional_id = prof.professional_id
      LEFT JOIN Profile prof_profile ON prof.profile_id = prof_profile.profile_id
      ORDER BY p.first_name, p.last_name
    `;
    const conn = connection || db;
    const [rows] = await conn.query(query);
    return rows;
  }

  async findByIdWithGoals(clientId, connection) {
    const query = `
      SELECT 
        c.client_id,
        c.goals as client_goals,
        c.experience_level,
        c.assigned_professional_id,
        p.first_name,
        p.last_name,
        p.email,
        p.goals as profile_goals,
        p.weight_kg,
        p.height_cm,
        p.birth_date,
        p.gender,
        p.registration_date,
        u.username,
        u.user_status,
        prof.professional_id,
        prof_profile.first_name as professional_first_name,
        prof_profile.last_name as professional_last_name
      FROM Client c
      JOIN Profile p ON c.profile_id = p.profile_id
      JOIN User u ON p.user_id = u.user_id
      LEFT JOIN Professional prof ON c.assigned_professional_id = prof.professional_id
      LEFT JOIN Profile prof_profile ON prof.profile_id = prof_profile.profile_id
      WHERE c.client_id = ?
    `;
    const conn = connection || db;
    const [rows] = await conn.query(query, [clientId]);
    return rows[0] || null;
  }

  async findByGoal(goalType, connection) {
    const query = `
      SELECT 
        c.client_id,
        c.goals as client_goals,
        c.experience_level,
        c.assigned_professional_id,
        p.first_name,
        p.last_name,
        p.email,
        p.goals as profile_goals,
        p.weight_kg,
        p.height_cm,
        p.birth_date,
        p.gender,
        p.registration_date,
        u.username,
        u.user_status,
        prof_profile.first_name as professional_first_name,
        prof_profile.last_name as professional_last_name
      FROM Client c
      JOIN Profile p ON c.profile_id = p.profile_id
      JOIN User u ON p.user_id = u.user_id
      LEFT JOIN Professional prof ON c.assigned_professional_id = prof.professional_id
      LEFT JOIN Profile prof_profile ON prof.profile_id = prof_profile.profile_id
      WHERE p.goals = ? OR c.goals LIKE ?
      ORDER BY p.first_name, p.last_name
    `;
    const conn = connection || db;
    const [rows] = await conn.query(query, [goalType, `%${goalType}%`]);
    return rows;
  }
}

export default new ClientRepository(); 