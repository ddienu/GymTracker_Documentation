import clientRepository from '../repositories/clientRepository.js';
import clientService from '../services/clientService.js';

class ClientController {
  /**
   * Obtiene los detalles de cliente del usuario autenticado.
   */
  async getClientDetails(req, res, next) {
    try {
      const userId = req.user.id;
      const clientDetails = await clientService.getClientDetailsByUserId(userId);
      res.status(200).json(clientDetails);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualiza los detalles de cliente del usuario autenticado.
   */
  async updateClientDetails(req, res, next) {
    try {
      const userId = req.user.id;
      const clientData = req.body;
      const updatedClientDetails = await clientService.updateClientDetails(userId, clientData);
      res.status(200).json({ message: 'Detalles del cliente actualizados con éxito.', client: updatedClientDetails });
    } catch (error) {
      next(error);
    }
  }

  async getAllClients(req, res, next) {
    try{
      const getClients = await clientService.getAllClients();
      res.status(200).json({ message: 'Cliente obtenidos con exito', client: getClients});
    }catch(error){
      next(error);
    }
  }

  async getClientByUserId(req, res, next){
    try{
      const userId = req.params.clientId;
      console.log(userId);
      const getClientByUserId = await clientRepository.findClientByUserId(userId);
      res.status(200).json({
        message: `Cliente con ID ${userId} encontrado exitosamente`,
        client: getClientByUserId
      });
    }catch(error){
      next(error);
    }
  }

  async updateClientStatus(req, res, next){
    try{
      const clientId = req.params.clientId;
      const repositoryResponse = await clientRepository.updateClientStatus(clientId);
      res.status(200).json({
        message: `Cliente con ID ${clientId} actualizado correctamente`,
        client: repositoryResponse
      });
    }catch(error){
      next(error);
    }
  }

  async updateClient(req, res, next) {
    try {
      const clientId = req.params.clientId; 
      const clientData = req.body;

      if (!clientId || !clientData) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
      }

      const repositoryResponse = await clientRepository.updateClient(clientId, clientData);

      res.status(200).json({
        message: `Cliente con ID ${clientId} actualizado correctamente`,
        result: repositoryResponse
      });

    } catch (error) {
      next(error);
    }
  }


  /**
   * Crea un nuevo cliente.
   */
  async createClient(req, res, next) {
    try {
      const clientData = req.body;
      const newClient = await clientService.createClient(clientData);
      res.status(201).json({ message: 'Cliente creado con éxito.', client: newClient });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene un cliente por su ID.
   */
  async getClientById(req, res, next) {
    try {
      const { id } = req.params;
      console.log({id});
      const client = await clientService.getClientById(id);
      res.status(200).json(client);
    } catch (error) {
      next(error);
    }
  }

  async deleteClient(req, res, next){
    try{
      const id = req.params.clientId;
      const result = await clientService.deleteClient(id);
      res.status(200).json(result);
    }catch(error){
      next(error);
    }
  }
}

export default new ClientController(); 