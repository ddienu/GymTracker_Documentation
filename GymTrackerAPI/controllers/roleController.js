import roleService from '../services/roleService.js';

/**
 * El Controlador de Roles maneja las solicitudes HTTP.
 */
class RoleController {
  /**
   * Maneja la solicitud para crear un nuevo rol.
   */
  async createRole(req, res, next) {
    try {
      const { name, description } = req.body;
      if (!name) {
        const error = new Error('El campo nombre es obligatorio.');
        error.statusCode = 400;
        throw error;
      }
      const newRole = await roleService.createRole({ name, description });
      res.status(201).json(newRole);
    } catch (error) {
      next(error);
    }
  }

  async getAllRoles(req, res, next) {
    try {
      const roles = await roleService.getAllRoles();
      res.status(200).json(roles);
    } catch (error) {
      next(error);
    }
  }

  async getRoleById(req, res, next) {
    try {
      const { id } = req.params;
      const role = await roleService.getRoleById(id);
      res.status(200).json(role);
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) {
        const error = new Error('El campo nombre es obligatorio.');
        error.statusCode = 400;
        throw error;
      }
      const updatedRole = await roleService.updateRole(id, req.body);
      res.status(200).json(updatedRole);
    } catch (error) {
      next(error);
    }
  }

  async deleteRole(req, res, next) {
    try {
      const { id } = req.params;
      await roleService.deleteRole(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new RoleController(); 