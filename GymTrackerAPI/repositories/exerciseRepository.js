import pool from '../config/db.js';

/**
 * El Repositorio de Ejercicios encapsula la lógica de acceso a datos
 * para la entidad 'Exercise'.
 */
class ExerciseRepository {
  async create({ name, description, difficulty, type, main_muscle, secondary_muscles, demo_video_url }) {
    const [result] = await pool.execute(
      'INSERT INTO Exercise (name, description, difficulty, type, main_muscle, secondary_muscles, demo_video_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, difficulty, type, main_muscle, secondary_muscles, demo_video_url]
    );
    return result;
  }

  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM Exercise WHERE exercise_id = ?', [id]);
    return rows[0] || null;
  }

  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM Exercise');
    return rows;
  }

  async update(id, exerciseData) {
    const fields = [];
    const values = [];
    const allowedFields = ['name', 'description', 'difficulty', 'type', 'main_muscle', 'secondary_muscles', 'demo_video_url'];

    for (const key of allowedFields) {
      const value = exerciseData[key];
      // Si el valor no está definido en el body, lo ignoramos.
      if (value !== undefined) {
        // Para los campos ENUM, si el valor es una cadena vacía o nulo,
        // lo saltamos para evitar el error "Data truncated".
        if ((key === 'difficulty' || key === 'type') && (value === null || value === '')) {
          continue;
        }
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return { changedRows: 0 };
    }

    values.push(id);
    const sql = `UPDATE Exercise SET ${fields.join(', ')} WHERE exercise_id = ?`;
    const [result] = await pool.execute(sql, values);
    return result;
  }

  async remove(id) {
    const [result] = await pool.execute('DELETE FROM Exercise WHERE exercise_id = ?', [id]);
    return result;
  }
}

export default new ExerciseRepository(); 