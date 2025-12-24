import userService from "../services/userService.js";

class UserController {
  /**
   * Crea un nuevo usuario con un rol específico.
   * Esta es una operación solo para administradores.
   */
  async createUser(req, res, next) {
    try {
      const userData = req.body;
      // Validación básica de los campos requeridos
      const { username, password, first_name, email, role_id } = userData;
      if (!username || !password || !first_name || !email || !role_id) {
        const error = new Error(
          "Los campos username, password, first_name, email y role_id son obligatorios."
        );
        error.statusCode = 400;
        throw error;
      }

      const newUser = await userService.createUser(userData);
      res
        .status(201)
        .json({ message: "Usuario creado con éxito.", user: newUser });
    } catch (error) {
      next(error);
    }
  }

  async getAllClients(req, res, next) {
    try {
      const clients = await userService.getAllClients();
      res.status(200).json(clients);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene todos los usuarios.
   */
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene un usuario por su ID.
   */
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualiza un usuario existente.
   */
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const userData = req.body;

      if (Object.keys(userData).length === 0) {
        return res
          .status(400)
          .json({ message: "No se enviaron datos para actualizar." });
      }

      const updatedUser = await userService.updateUser(id, userData);
      res
        .status(200)
        .json({ message: "Usuario actualizado con éxito.", user: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Elimina un usuario.
   */
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const result = await userService.deleteUser(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async reactivateUser(req, res, next) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({
          message: "UserId is required",
        });
      }

      const result = await userService.reactivateUser(userId);
      if (result.affectedRows != 0) {
        return res.status(200).json({
          message: "User reactivated successfully",
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
