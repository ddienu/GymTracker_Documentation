import db from '../config/db.js';

class AdministratorRepository {
  /**
   * Busca un administrador por su profile_id.
   * @param {number} profileId - El ID del perfil a buscar.
   * @param {object} [connection=db] - La conexión de base de datos a utilizar.
   * @returns {Promise<object|null>} El registro del administrador o null si no se encuentra.
   */
  async findByProfileId(profileId, connection) {
    const query = 'SELECT * FROM Administrator WHERE profile_id = ?';
    const conn = connection || db;
    const [rows] = await conn.query(query, [profileId]);
    return rows[0] || null;
  }

  /**
   * Crea un nuevo registro de administrador.
   * @param {number} profileId - El ID del perfil del nuevo administrador.
   * @param {object} [connection=db] - La conexión de base de datos a utilizar.
   * @returns {Promise<object>} El resultado de la inserción.
   */
  async create(profileId, connection) {
    const query = 'INSERT INTO Administrator (profile_id, permissions_level) VALUES (?, ?)';
    const conn = connection || db;
    // El valor por defecto según el schema es 1.
    const [result] = await conn.query(query, [profileId, 1]); 
    return { id: result.insertId, profileId };
  }
}

export default new AdministratorRepository(); 