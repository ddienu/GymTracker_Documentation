import productService from '../services/productService.js';

/**
 * El Controlador de Productos maneja las solicitudes HTTP entrantes,
 * realiza validaciones básicas y delega la lógica de negocio a la capa de servicio.
 * Se comunica en términos de HTTP (req, res, next).
 */
class ProductController {

  /**
   * Maneja la solicitud para crear un nuevo producto.
   * @param {object} req - El objeto de solicitud de Express.
   * @param {object} res - El objeto de respuesta de Express.
   * @param {function} next - La función para pasar al siguiente middleware (manejo de errores).
   */
  async createProduct(req, res, next) {
    try {
      // 1. Extracción y Validación de Entrada
      const { name, description, price, stock } = req.body;
      if (!name || price == null || stock == null) {
        const error = new Error('Los campos nombre, precio y stock son obligatorios.');
        error.statusCode = 400; // Bad Request
        throw error;
      }

      // 2. Delegación al Servicio
      const newProduct = await productService.createProduct({ name, description, price, stock });

      // 3. Envío de Respuesta Exitosa
      res.status(201).json(newProduct);

    } catch (error) {
      // Si algo sale mal (validación, lógica de negocio, DB), pasa al manejador de errores.
      next(error);
    }
  }

  /**
   * Maneja la solicitud para obtener todos los productos.
   */
  async getAllProducts(req, res, next) {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Maneja la solicitud para obtener un producto por su ID.
   */
  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Maneja la solicitud para actualizar un producto.
   */
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'No se enviaron datos para actualizar.' });
      }

      const updatedProduct = await productService.updateProduct(id, updateData);
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Maneja la solicitud para eliminar un producto.
   */
  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);
      res.status(204).send(); // 204 No Content
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController(); 