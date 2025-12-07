import productRepository from '../repositories/productRepository.js';

/**
 * La Capa de Servicio para Productos.
 * Contiene la lógica de negocio y orquesta las operaciones llamando
 * a la capa de repositorio. No debe interactuar directamente con la base de datos
 * ni con los objetos de solicitud/respuesta HTTP.
 */
class ProductService {

  /**
   * Crea un nuevo producto.
   * @param {object} productData - Datos del producto a crear.
   * @returns {Promise<object>} El producto recién creado.
   * @throws {Error} Si los datos del negocio son inválidos (ej. precio negativo).
   */
  async createProduct(productData) {
    // 1. Validación de lógica de negocio
    if (productData.price < 0) {
      const error = new Error('El precio del producto no puede ser negativo.');
      error.statusCode = 400; // Bad Request
      throw error;
    }
    if (productData.stock < 0) {
        const error = new Error('El stock del producto no puede ser negativo.');
        error.statusCode = 400; // Bad Request
        throw error;
    }

    // 2. Orquestación: llamar al repositorio para crear el producto
    const result = await productRepository.create(productData);
    const insertedId = result.insertId;

    // 3. Orquestación: Obtener el producto recién creado para devolverlo
    const newProduct = await productRepository.findById(insertedId);

    return newProduct;
  }

  /**
   * Obtiene todos los productos.
   * @returns {Promise<Array>} Un array de productos.
   */
  async getAllProducts() {
    return await productRepository.findAll();
  }

  /**
   * Obtiene un producto por su ID.
   * @param {number} id - El ID del producto.
   * @returns {Promise<object>} El producto encontrado.
   * @throws {Error} Si el producto no se encuentra.
   */
  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      const error = new Error('Producto no encontrado.');
      error.statusCode = 404; // Not Found
      throw error;
    }
    return product;
  }

  /**
   * Actualiza un producto existente.
   * @param {number} id - El ID del producto a actualizar.
   * @param {object} updateData - Los datos para actualizar.
   * @returns {Promise<object>} El producto actualizado.
   */
  async updateProduct(id, updateData) {
    // 1. Asegurarse de que el producto exista primero.
    const existingProduct = await productRepository.findById(id);
    if (!existingProduct) {
      const error = new Error('Producto no encontrado para actualizar.');
      error.statusCode = 404;
      throw error;
    }

    // 2. Validar la lógica de negocio para los campos que se están actualizando.
    if (updateData.price != null && updateData.price < 0) {
      const error = new Error('El precio del producto no puede ser negativo.');
      error.statusCode = 400;
      throw error;
    }
    if (updateData.stock != null && updateData.stock < 0) {
      const error = new Error('El stock del producto no puede ser negativo.');
      error.statusCode = 400;
      throw error;
    }

    // 3. Llamar al repositorio para actualizar.
    await productRepository.update(id, updateData);

    // 4. Devolver el producto actualizado.
    return await productRepository.findById(id);
  }

  /**
   * Elimina un producto.
   * @param {number} id - El ID del producto a eliminar.
   * @returns {Promise<void>}
   */
  async deleteProduct(id) {
    // 1. Asegurarse de que el producto exista primero.
    const existingProduct = await productRepository.findById(id);
    if (!existingProduct) {
      const error = new Error('Producto no encontrado para eliminar.');
      error.statusCode = 404;
      throw error;
    }

    // 2. Llamar al repositorio para eliminar.
    await productRepository.remove(id);
  }
}

export default new ProductService(); 