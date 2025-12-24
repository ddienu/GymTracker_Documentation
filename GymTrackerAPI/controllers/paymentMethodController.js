import paymentMethodService from '../services/paymentMethodService.js';

/**
 * El Controlador de Métodos de Pago maneja las solicitudes HTTP.
 */
class PaymentMethodController {
  async createPaymentMethod(req, res, next) {
    try {
      const { name, transaction_fee = 0.00, is_active = true } = req.body;
      if (!name) {
        const error = new Error('El campo nombre es obligatorio.');
        error.statusCode = 400;
        throw error;
      }
      const newData = await paymentMethodService.createPaymentMethod({ name, transaction_fee, is_active });
      res.status(201).json(newData);
    } catch (error) {
      next(error);
    }
  }

  async getAllPaymentMethods(req, res, next) {
    try {
      const data = await paymentMethodService.getAllPaymentMethods();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getPaymentMethodById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await paymentMethodService.getPaymentMethodById(id);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async updatePaymentMethod(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) {
        const error = new Error('El campo nombre es obligatorio.');
        error.statusCode = 400;
        throw error;
      }
      const updatedData = await paymentMethodService.updatePaymentMethod(id, req.body);
      res.status(200).json(updatedData);
    } catch (error) {
      next(error);
    }
  }

  async deletePaymentMethod(req, res, next) {
    try {
      const { id } = req.params;
      await paymentMethodService.deletePaymentMethod(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentMethodController(); 