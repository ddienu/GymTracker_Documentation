import pool from '../config/db.js';

/**
 * El Repositorio de Comidas encapsula la lógica de acceso a datos
 * para la entidad 'Meal'.
 */
class MealRepository {
  async create({ name, description, calories, protein_g, carbs_g, fat_g }) {
    const [result] = await pool.execute(
      'INSERT INTO Meal (name, description, calories, protein_g, carbs_g, fat_g) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, calories, protein_g, carbs_g, fat_g]
    );
    return result;
  }

  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM Meal WHERE meal_id = ?', [id]);
    return rows[0] || null;
  }

  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM Meal');
    return rows;
  }

  async update(id, { name, description, calories, protein_g, carbs_g, fat_g }) {
    const [result] = await pool.execute(
      'UPDATE Meal SET name = ?, description = ?, calories = ?, protein_g = ?, carbs_g = ?, fat_g = ? WHERE meal_id = ?',
      [name, description, calories, protein_g, carbs_g, fat_g, id]
    );
    return result;
  }

  async remove(id) {
    const [result] = await pool.execute('DELETE FROM Meal WHERE meal_id = ?', [id]);
    return result;
  }
}

export default new MealRepository(); 