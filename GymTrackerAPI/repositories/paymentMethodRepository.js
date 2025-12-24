import pool from '../config/db.js';

/**
 * El Repositorio de Métodos de Pago encapsula la lógica de acceso a datos
 * para la entidad 'PaymentMethod'.
 */
class PaymentMethodRepository {
  /**
   * Inserta un nuevo método de pago.
   * @param {object} data - { name, transaction_fee, is_active }
   */
  async create({ name, transaction_fee, is_active }) {
    const [result] = await pool.execute(
      'INSERT INTO PaymentMethod (name, transaction_fee, is_active) VALUES (?, ?, ?)',
      [name, transaction_fee, is_active]
    );
    return result;
  }

  /**
   * Encuentra un método de pago por su ID.
   */
  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM PaymentMethod WHERE payment_method_id = ?', [id]);
    return rows[0] || null;
  }

  /**
   * Obtiene todos los métodos de pago.
   */
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM PaymentMethod');
    return rows;
  }

  /**
   * Actualiza un método de pago de forma dinámica.
   */
  async update(id, paymentData) {
    const fields = Object.keys(paymentData).map(key => `${key} = ?`);
    const values = Object.values(paymentData);

    if (fields.length === 0) {
      return { changedRows: 0 };
    }

    values.push(id);
    const sql = `UPDATE PaymentMethod SET ${fields.join(', ')} WHERE payment_method_id = ?`;
    const [result] = await pool.execute(sql, values);
    return result;
  }

  /**
   * Elimina un método de pago.
   */
  async remove(id) {
    const [result] = await pool.execute('DELETE FROM PaymentMethod WHERE payment_method_id = ?', [id]);
    return result;
  }
}

export default new PaymentMethodRepository(); 