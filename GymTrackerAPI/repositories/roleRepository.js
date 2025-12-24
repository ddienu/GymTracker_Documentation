import pool from '../config/db.js';

/**
 * El Repositorio de Roles encapsula toda la lógica de acceso a datos
 * para la entidad 'Role'.
 */
class RoleRepository {
  /**
   * Inserta un nuevo rol en la base de datos.
   * @param {object} roleData - { name, description }
   * @returns {Promise<object>} El resultado de la inserción.
   */
  async create({ name, description }) {
    const [result] = await pool.execute(
      'INSERT INTO Role (name, description) VALUES (?, ?)',
      [name, description]
    );
    return result;
  }

  /**
   * Encuentra un rol por su ID.
   * @param {number} id - El ID del rol.
   * @returns {Promise<object|null>} El rol encontrado o null.
   */
  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM Role WHERE role_id = ?', [id]);
    return rows[0] || null;
  }

  /**
   * Obtiene todos los roles de la base de datos.
   * @returns {Promise<Array>} Un array con todos los roles.
   */
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM Role');
    return rows;
  }

  /**
   * Actualiza un rol en la base de datos de forma dinámica.
   */
  async update(id, roleData) {
    const fields = Object.keys(roleData).map(key => `${key} = ?`);
    const values = Object.values(roleData);

    if (fields.length === 0) {
      return { changedRows: 0 };
    }

    values.push(id);
    const sql = `UPDATE Role SET ${fields.join(', ')} WHERE role_id = ?`;
    const [result] = await pool.execute(sql, values);
    return result;
  }

  /**
   * Elimina un rol de la base de datos.
   * @param {number} id - El ID del rol a eliminar.
   * @returns {Promise<object>} El resultado de la operación.
   */
  async remove(id) {
    const [result] = await pool.execute('DELETE FROM Role WHERE role_id = ?', [id]);
    return result;
  }

  async findByName(name, connection) {
    const query = 'SELECT * FROM Role WHERE name = ?';
    const conn = connection || pool;
    const [rows] = await conn.execute(query, [name]);
    return rows[0];
  }

  async findRolesByUserId(userId, connection) {
    const query = `
      SELECT r.* 
      FROM Role r
      JOIN User u ON r.role_id = u.role_id
      WHERE u.user_id = ?
    `;
    const conn = connection || pool;
    const [rows] = await conn.execute(query, [userId]);
    // Dado que un usuario ahora solo tiene un rol, devolvemos un array con ese único rol
    // para mantener la compatibilidad con el código del servicio que espera un array (userRoles.some(...))
    return rows;
  }

  async updateRoleToProfessional(profileId, connection){
    const query = `
      UPDATE User AS t1
      INNER JOIN Profile AS t2 ON t1.user_id = t2.user_id
      SET role_id = 2
      WHERE t2.profile_id = ?
    `;
    const conn = connection || pool;
    const [rows] = await conn.execute(query, [profileId]);
    return rows;
  }
}

export default new RoleRepository(); 