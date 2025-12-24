import roleRepository from '../repositories/roleRepository.js';

/**
 * La Capa de Servicio para Roles.
 */
class RoleService {
  // Métodos de lógica de negocio para Roles.

  /**
   * Crea un nuevo rol.
   * @param {object} roleData - { name, description }
   * @returns {Promise<object>} El rol recién creado.
   */
  async createRole(roleData) {
    const result = await roleRepository.create(roleData);
    const newRoleId = result.insertId;
    return await roleRepository.findById(newRoleId);
  }

  async getAllRoles() {
    return await roleRepository.findAll();
  }

  async getRoleById(id) {
    const role = await roleRepository.findById(id);
    if (!role) {
      const error = new Error('Rol no encontrado.');
      error.statusCode = 404;
      throw error;
    }
    return role;
  }

  async updateRole(id, roleData) {
    // Asegurarse de que el rol exista
    await this.getRoleById(id);
    await roleRepository.update(id, roleData);
    return await roleRepository.findById(id);
  }

  async deleteRole(id) {
    // Asegurarse de que el rol exista
    await this.getRoleById(id);
    await roleRepository.remove(id);
  }
}

export default new RoleService(); 