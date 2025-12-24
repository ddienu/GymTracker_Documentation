import profileRepository from '../repositories/profileRepository.js';
import clientRepository from '../repositories/clientRepository.js';
import CustomError from '../utils/CustomError.js';

class ClientService {
  /**
   * Obtiene los detalles de un cliente por el ID de su usuario.
   * @param {number} userId - El ID del usuario.
   * @returns {Promise<object>} Los detalles del cliente.
   */
  async getClientDetailsByUserId(userId) {
    // 1. Encontrar el perfil a partir del userId
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
      throw new CustomError('Perfil de usuario no encontrado.', 404);
    }

    // 2. Encontrar los detalles del cliente a partir del profile_id
    const clientDetails = await clientRepository.findByProfileId(profile.profile_id);
    if (!clientDetails) {
      throw new CustomError('Detalles de cliente no encontrados. El usuario podría no ser un cliente.', 404);
    }

    return clientDetails;
  }

  /**
   * Actualiza los detalles de un cliente.
   * @param {number} userId - El ID del usuario.
   * @param {object} clientData - Los datos a actualizar (ej. { goals, experience_level }).
   * @returns {Promise<object>} Los detalles del cliente actualizados.
   */
  async updateClientDetails(userId, clientData) {
    // 1. Obtener los detalles actuales del cliente para conseguir su ID.
    const existingClientDetails = await this.getClientDetailsByUserId(userId);

    // 2. Actualizar los datos usando el client_id
    const updatedClient = await clientRepository.update(existingClientDetails.client_id, clientData);
    return updatedClient;
  }

  async getAllClients(){
    const fetchClients = await clientRepository.findAll();
    return fetchClients;
  }

  /**
   * Obtiene un cliente por su ID.
   * @param {number} clientId - El ID del cliente.
   * @returns {Promise<object>} Los detalles del cliente.
   */
  async getClientById(clientId) {
    const client = await clientRepository.findById(clientId);
    if (!client) {
      throw new CustomError('Cliente no encontrado.', 404);
    }
    return client;
  }

  /**
   * Crea un nuevo cliente.
   * @param {object} clientData - Los datos del cliente.
   * @returns {Promise<object>} El cliente creado.
   */
  async createClient(clientData) {
    const newClient = await clientRepository.create(clientData);
    return newClient;
  }

  /**
   * Actualiza un cliente por su ID.
   * @param {number} clientId - El ID del cliente.
   * @param {object} clientData - Los datos a actualizar.
   * @returns {Promise<object>} El cliente actualizado.
   */
  async updateClient(clientId, clientData) {
    const existingClient = await clientRepository.findById(clientId);
    if (!existingClient) {
      throw new CustomError('Cliente no encontrado.', 404);
    }

    const result = await clientRepository.update(clientId, clientData);
    if (result.changedRows === 0) {
      throw new CustomError('No se pudo actualizar el cliente.', 400);
    }

    return await clientRepository.findById(clientId);
  }

  /**
   * Elimina un cliente por su ID.
   * @param {number} clientId - El ID del cliente.
   * @returns {Promise<object>} Mensaje de confirmación.
   */
  async deleteClient(clientId) {
    const existingClient = await clientRepository.findById(clientId);
    if (!existingClient) {
      throw new CustomError('Cliente no encontrado.', 404);
    }

    const result = await clientRepository.delete(clientId);
    if (result.affectedRows === 0) {
      throw new CustomError('No se pudo eliminar el cliente.', 400);
    }

    return { message: 'Cliente eliminado exitosamente.' };
  }
}

export default new ClientService(); 