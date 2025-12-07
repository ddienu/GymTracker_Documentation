import pool from '../config/db.js';

/**
 * El Repositorio de Servicios encapsula la lógica de acceso a datos
 * para la entidad 'Service'.
 */
class ServiceRepository {
  async create(serviceData) {
    const { name, description, price, service_type, duration_days, is_active } = serviceData;
    const [result] = await pool.execute(
      'INSERT INTO Service (name, description, price, service_type, duration_days, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, service_type, duration_days, is_active]
    );
    return result;
  }

  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM Service WHERE service_id = ?', [id]);
    return rows[0] || null;
  }

  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM Service');
    return rows;
  }

  async update(id, serviceData) {
    const fields = [];
    const values = [];
    // Lista de campos permitidos para la actualización
    const allowedFields = ['name', 'description', 'price', 'service_type', 'duration_days', 'is_active'];

    for (const key of allowedFields) {
      const value = serviceData[key];
      if (value !== undefined) {
        // Los ENUMs no deben ser nulos ni vacíos
        if (key === 'service_type' && (value === null || value === '')) {
            continue;
        }
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return { changedRows: 0 }; // No hay nada que actualizar
    }

    values.push(id);
    const sql = `UPDATE Service SET ${fields.join(', ')} WHERE service_id = ?`;
    const [result] = await pool.execute(sql, values);
    return result;
  }

  async remove(id) {
    const [result] = await pool.execute('DELETE FROM Service WHERE service_id = ?', [id]);
    return result;
  }

  async deactivateService(id){
    const [result] = await pool.execute('UPDATE Service SET is_active = 0 WHERE service_id = ?', [id]);
    return result;
  }
}

export default new ServiceRepository(); 