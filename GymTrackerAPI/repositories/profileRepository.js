import pool from '../config/db.js';

class ProfileRepository {
  /**
   * Crea un nuevo perfil.
   * @param {object} profileData - Datos del perfil.
   * @param {object} [connection=pool] - Conexión de BD opcional para transacciones.
   */
  async create(profileData, connection = pool) {
    const { user_id, document_number, first_name, last_name, email, birth_date, gender, weight_kg, height_cm, goals } = profileData;
    const query = 'INSERT INTO Profile (user_id, document_number, first_name, last_name, email, birth_date, gender, weight_kg, height_cm, goals) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    // Aseguramos que los campos opcionales sean NULL si no se proporcionan
    const values = [
      user_id,
      document_number,
      first_name,
      last_name || null,
      email,
      birth_date || null,
      gender || null,
      weight_kg || null,
      height_cm || null,
      goals || null
    ];

    const conn = connection || pool;
    const [result] = await conn.execute(query, values);
    return { profile_id: result.insertId, ...profileData };
  }

  /**
   * Busca un perfil por el ID de usuario.
   * @param {number} userId - El ID del usuario.
   * @returns {object|null} El perfil encontrado o null si no existe.
   */
  async findByUserId(userId) {
    const [rows] = await pool.execute('SELECT * FROM Profile WHERE user_id = ?', [userId]);
    return rows[0] || null;
  }

  async findProfileIdByEmail(email){
    const [rows] = await pool.execute('SELECT profile_id FROM Profile WHERE email = ?', [email]);
    return rows[0] || null;
  }

  /**
   * Actualiza un perfil por su ID.
   * @param {number} profileId - El ID del perfil.
   * @param {object} profileData - Los datos a actualizar.
   * @returns {object} El perfil actualizado.
   */
  async update(profileId, profileData) {
    const fieldsToUpdate = Object.keys(profileData)
      .filter(key => profileData[key] !== undefined)
      .map(key => `${key} = ?`);

    if (fieldsToUpdate.length === 0) {
      return this.findByUserId( (await this.findById(profileId)).user_id ); // Devuelve el perfil sin cambios
    }

    const values = Object.values(profileData).filter(value => value !== undefined);
    values.push(profileId);

    const sql = `UPDATE Profile SET ${fieldsToUpdate.join(', ')} WHERE profile_id = ?`;

    await pool.execute(sql, values);
    return this.findById(profileId);
  }

  /**
   * Busca un perfil por su ID primario.
   * @param {number} profileId - El ID del perfil.
   * @returns {object|null} El perfil encontrado o null si no existe.
   */
  async findById(profileId) {
    const [rows] = await pool.execute('SELECT * FROM Profile WHERE profile_id = ?', [profileId]);
    return rows[0] || null;
  }

  async findProfileByEmail(email){
    const [rows] = await pool.execute('SELECT * FROM Profile WHERE email = ?', [email]);
    return rows[0] || null;
  }
}

export default new ProfileRepository(); 