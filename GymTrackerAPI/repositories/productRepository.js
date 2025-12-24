import pool from '../config/db.js';

/**
 * El Repositorio de Productos encapsula toda la lógica de acceso a datos
 * para la entidad 'Producto'. Su responsabilidad es exclusivamente interactuar
 * con la base de datos.
 */
class ProductRepository {

  /**
   * Inserta un nuevo producto en la base de datos.
   * @param {object} productData - Los datos del producto a crear (name, description, price, stock).
   * @returns {Promise<object>} El resultado de la inserción, que incluye el ID del nuevo producto.
   */
  async create({ name, description, price, stock }) {
    const [result] = await pool.execute(
      'INSERT INTO Product (name, description, price, stock) VALUES (?, ?, ?, ?)',
      [name, description, price, stock]
    );
    return result;
  }

  /**
   * Encuentra un producto por su ID.
   * @param {number} id - El ID del producto a buscar.
   * @returns {Promise<object|null>} El producto encontrado o null si no existe.
   */
  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM Product WHERE product_id = ?', [id]);
    return rows[0] || null;
  }

  /**
   * Encuentra un producto que representa un servicio por el ID del servicio.
   * Busca una etiqueta especial en la descripción del producto.
   * @param {number} serviceId - El ID del servicio a buscar.
   * @returns {Promise<object|null>} El producto encontrado o null si no existe.
   */
  async findByServiceId(serviceId) {
    const searchTag = `[SERVICE_ID:${serviceId}]`;
    const [rows] = await pool.execute(
      'SELECT * FROM Product WHERE description LIKE ?',
      [`%${searchTag}%`]
    );
    return rows[0] || null;
  }

  /**
   * Obtiene todos los productos de la base de datos.
   * @returns {Promise<Array>} Un array con todos los productos.
   */
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM Product');
    return rows;
  }

  /**
   * Actualiza un producto en la base de datos.
   * @param {number} id - El ID del producto a actualizar.
   * @param {object} productData - Un objeto con los campos a actualizar.
   * @returns {Promise<object>} El resultado de la operación de actualización.
   */
  async update(id, productData) {
    const fields = [];
    const values = [];

    // Construye dinámicamente la consulta basándose en los datos proporcionados.
    for (const [key, value] of Object.entries(productData)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      // Si no hay campos para actualizar, no hacemos nada.
      return { changedRows: 0 };
    }

    values.push(id); // Añade el ID al final para la cláusula WHERE.

    const sql = `UPDATE Product SET ${fields.join(', ')} WHERE product_id = ?`;

    const [result] = await pool.execute(sql, values);
    return result;
  }

  /**
   * Disminuye el stock de un producto de forma atómica.
   * @param {number} productId - El ID del producto.
   * @param {number} quantity - La cantidad a disminuir.
   * @param {object} connection - La conexión de BD para la transacción.
   * @returns {Promise<object>} El resultado de la operación de actualización.
   */
  async decreaseStock(productId, quantity, connection) {
    const sql = `UPDATE Product SET stock = stock - ? WHERE product_id = ? AND stock >= ?`;
    const conn = connection || pool;
    const [result] = await conn.execute(sql, [quantity, productId, quantity]);
    return result;
  }

  /**
   * Elimina un producto de la base de datos.
   * @param {number} id - El ID del producto a eliminar.
   * @returns {Promise<object>} El resultado de la operación de eliminación.
   */
  async remove(id) {
    const [result] = await pool.execute('DELETE FROM Product WHERE product_id = ?', [id]);
    return result;
  }
}

export default new ProductRepository(); 