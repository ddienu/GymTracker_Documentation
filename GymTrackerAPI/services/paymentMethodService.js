import paymentMethodRepository from '../repositories/paymentMethodRepository.js';

/**
 * La Capa de Servicio para Métodos de Pago.
 */
class PaymentMethodService {
  async createPaymentMethod(data) {
    const result = await paymentMethodRepository.create(data);
    const newId = result.insertId;
    return await paymentMethodRepository.findById(newId);
  }

  async getAllPaymentMethods() {
    return await paymentMethodRepository.findAll();
  }

  async getPaymentMethodById(id) {
    const paymentMethod = await paymentMethodRepository.findById(id);
    if (!paymentMethod) {
      const error = new Error('Método de pago no encontrado.');
      error.statusCode = 404;
      throw error;
    }
    return paymentMethod;
  }

  async updatePaymentMethod(id, data) {
    await this.getPaymentMethodById(id); // Asegurarse de que exista
    await paymentMethodRepository.update(id, data);
    return await paymentMethodRepository.findById(id);
  }

  async deletePaymentMethod(id) {
    await this.getPaymentMethodById(id); // Asegurarse de que exista
    await paymentMethodRepository.remove(id);
  }
}

export default new PaymentMethodService(); 