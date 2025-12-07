import serviceService from '../services/serviceService.js';

/**
 * El Controlador de Servicios maneja las solicitudes HTTP.
 */
class ServiceController {
  async createService(req, res, next) {
    try {
      const { name, price } = req.body;
      if (!name || price === undefined) {
        const error = new Error('Los campos nombre y precio son obligatorios.');
        error.statusCode = 400;
        throw error;
      }
      const newService = await serviceService.createService(req.body);
      res.status(201).json(newService);
    } catch (error) {
      next(error);
    }
  }

  async getAllServices(req, res, next) {
    try {
      const services = await serviceService.getAllServices();
      res.status(200).json(services);
    } catch (error) {
      next(error);
    }
  }

  async getServiceById(req, res, next) {
    try {
      const { id } = req.params;
      const service = await serviceService.getServiceById(id);
      res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }

  async updateService(req, res, next) {
    try {
      const { id } = req.params;
      const { name, price } = req.body;
      if (!name || price === undefined) {
        const error = new Error('Los campos nombre y precio son obligatorios.');
        error.statusCode = 400;
        throw error;
      }
      const updatedService = await serviceService.updateService(id, req.body);
      res.status(200).json(updatedService);
    } catch (error) {
      next(error);
    }
  }

  async deleteService(req, res, next) {
    try {
      const { id } = req.params;
      await serviceService.deleteService(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async deactivateService(req, res, next){
    try{
      const serviceId = req.params.serviceId;
      if( !serviceId ){
       return res.status(400).json({
          status: "error",
          message: "Falta el id del servicio"
       });
      }
      const serviceResponse = await serviceService.deactivateService(serviceId);
      res.status(200).json({
        message: `El servicio con ID: ${serviceId} desactivado satisfactoriamente`,
        data: serviceResponse
      });
    }catch(error){
      next(error);
    }
  }
}

export default new ServiceController(); 