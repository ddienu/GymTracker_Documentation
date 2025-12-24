import pool from '../config/db.js';

class UserRepository {
  async findByUsername(username) {
    const sql = `
      SELECT 
        u.user_id, 
        u.username, 
        u.password_hash, 
        u.user_status, 
        u.role_id, 
        p.profile_id,
        prof.professional_id,
        r.name AS role_name 
      FROM User AS u
      INNER JOIN Profile AS p ON u.user_id = p.user_id
      INNER JOIN Role AS r ON u.role_id = r.role_id
      LEFT JOIN Professional AS prof ON p.profile_id = prof.profile_id
      WHERE u.username = ?
    `;
    const [rows] = await pool.execute(sql, [username]);
    return rows[0] || null;
  }

  async findByEmail(email) {
    const sql = `SELECT 
        u.user_id, 
        u.username, 
        u.password_hash, 
        u.user_status, 
        u.role_id, 
        p.profile_id,
        p.email,
        p.first_name,
        p.last_name,
        p.weight_kg,
        p.height_cm,
        p.goals,
        prof.professional_id,
        r.name AS role_name 
      FROM User AS u
      INNER JOIN Profile AS p ON u.user_id = p.user_id
      INNER JOIN Role AS r ON u.role_id = r.role_id
      LEFT JOIN Professional AS prof ON p.profile_id = prof.profile_id
      WHERE p.email = ?`;
    const [rows] = await pool.execute(sql, [email]);
    return rows[0] || null;
  }

  /**
   * Crea un nuevo usuario.
   * @param {object} userData - Datos del usuario.
   * @param {object} [connection=pool] - Conexión de BD opcional para transacciones.
   */
  async create(userData, connection = pool) {
    const { username, password_hash, role_id } = userData;
    const [result] = await connection.execute(
      'INSERT INTO User (username, password_hash, role_id, user_status) VALUES (?, ?, ?, ?)',
      [username, password_hash, role_id, 'ACTIVE']
    );
    return { user_id: result.insertId, ...userData };
  }

  async findAll() {
    const [rows] = await pool.execute('SELECT user_id, username, user_status, role_id FROM User');
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.execute('SELECT user_id, username, user_status, role_id FROM User WHERE user_id = ?', [id]);
    return rows[0];
  }

  async update(id, userData) {
    const fields = [];
    const values = [];
    const allowedFields = ['username', 'user_status', 'role_id'];

    for (const key of allowedFields) {
      const value = userData[key];
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return { changedRows: 0 };
    }

    values.push(id);
    const sql = `UPDATE User SET ${fields.join(', ')} WHERE user_id = ?`;
    const [result] = await pool.execute(sql, values);
    return result;
  }

  async delete(id) {
    const [result] = await pool.execute('DELETE FROM User WHERE user_id = ?', [id]);
    return result;
  }

  async reactivateUser(userId){
    const query = `UPDATE User SET user_status = 'ACTIVE' WHERE user_id = ?`;
    const [result] = await pool.execute(query, [userId]);
    return result;
  }
}

export default new UserRepository(); 