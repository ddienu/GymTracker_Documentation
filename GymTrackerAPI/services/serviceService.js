import serviceRepository from '../repositories/serviceRepository.js';
import productRepository from '../repositories/productRepository.js';

/**
 * La Capa de Servicio para Servicios.
 * Contiene la lógica de negocio y orquesta las operaciones.
 */
class ServiceService {
  async createService(data) {
    // 1. Crear el servicio
    const result = await serviceRepository.create(data);
    const newService = await serviceRepository.findById(result.insertId);

    if (!newService) {
      throw new Error('No se pudo crear el servicio.');
    }

    // 2. Crear el producto "espejo" correspondiente
    // const productData = {
    //   name: newService.name,
    //   description: `${newService.description || ''}\n[SERVICE_ID:${newService.service_id}]`,
    //   price: newService.price,
    //   stock: 99999, // Usamos un número alto para representar stock "ilimitado"
    // };
    // await productRepository.create(productData);

    return newService;
  }

  async getAllServices() {
    return await serviceRepository.findAll();
  }

  async getServiceById(id) {
    const service = await serviceRepository.findById(id);
    if (!service) {
      const error = new Error('Servicio no encontrado.');
      error.statusCode = 404;
      throw error;
    }
    return service;
  }

  async updateService(id, data) {
    await this.getServiceById(id); // Validar existencia del servicio

    // 1. Actualizar el servicio
    await serviceRepository.update(id, data);

    // Obtener el servicio actualizado para tener todos los datos consistentes
    const updatedService = await serviceRepository.findById(id);

    // 2. Actualizar el producto "espejo"
    // const associatedProduct = await productRepository.findByServiceId(id);
    // if (associatedProduct) {
    //   const productUpdateData = {
    //     name: updatedService.name,
    //     description: `${updatedService.description || ''}\n[SERVICE_ID:${id}]`,
    //     price: updatedService.price,
    //   };
    //   await productRepository.update(associatedProduct.product_id, productUpdateData);
    // }

    return updatedService;
  }

  async deleteService(id) {
    await this.getServiceById(id); // Validar existencia del servicio

    // 1. Primero, eliminar el producto "espejo"
    // const associatedProduct = await productRepository.findByServiceId(id);
    // if (associatedProduct) {
    //   await productRepository.remove(associatedProduct.product_id);
    // }

    // 2. Luego, eliminar el servicio
    await serviceRepository.remove(id);
  }

  async deactivateService(id){
    const serviceFounded = await this.getServiceById(id);
    if(serviceFounded.is_active === 0){
      const error = new Error('El servicio ya está desactivado');
      (error).statusCode = 409;
      throw error;
    }
    await serviceRepository.deactivateService(id);
  }
}

export default new ServiceService(); 