import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import userRepository from '../repositories/userRepository.js';
import profileRepository from '../repositories/profileRepository.js';
import clientRepository from '../repositories/clientRepository.js';
import professionalRepository from '../repositories/professionalRepository.js';
import administratorRepository from '../repositories/administratorRepository.js';
import CustomError from '../utils/CustomError.js';

class UserService {
  /**
   * Crea un nuevo usuario, perfil y entidad de rol asociada (Cliente o Profesional).
   * @param {object} userData - Datos completos del usuario, incluyendo el rol.
   */
  async createUser(userData) {
    const { username, password, role_id, first_name, last_name, email, birth_date, gender } = userData;

    // 1. Validar que el usuario o email no existan
    const existingUser = await userRepository.findByUsername(username);
    if (existingUser) {
      throw new CustomError('El nombre de usuario ya está en uso.', 409);
    }
    const existingEmail = await profileRepository.findByEmail(email);
    if (existingEmail) {
      throw new CustomError('El correo electrónico ya está en uso.', 409);
    }

    // 2. Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Iniciar transacción
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 4. Crear el usuario
      const userResult = await userRepository.create({ username, password_hash, role_id }, connection);
      const userId = userResult.insertId;

      // 5. Crear el perfil
      const profileResult = await profileRepository.create({
        user_id: userId,
        first_name,
        last_name: last_name || null,
        email,
        birth_date: birth_date || null,
        gender: gender || null
      }, connection);
      const profileId = profileResult.insertId;

      // 6. Crear la entidad de rol específica (Cliente, Profesional o Administrador)
      if (role_id === 2) { // Rol de Cliente
        await clientRepository.create({ profile_id: profileId }, connection);
      } else if (role_id === 3) { // Rol de Profesional
        await professionalRepository.create({ profile_id: profileId }, connection);
      } else if (role_id === 1) { // Rol de Administrador
        await administratorRepository.create({ profile_id: profileId }, connection);
      }
      // Nota: Para otros roles como Administrador (role_id=1), no se crea entidad adicional.

      // 7. Si todo va bien, confirmar la transacción
      await connection.commit();

      return { id: userId, username, email, first_name, role_id };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getAllClients() {
    return await clientRepository.findAll();
  }

  async getAllUsers() {
    return await userRepository.findAll();
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new CustomError('Usuario no encontrado.', 404);
    }
    return user;
  }

  async updateUser(id, userData) {
    // Verificar que el usuario existe
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new CustomError('Usuario no encontrado.', 404);
    }

    // Si se está actualizando el username, verificar que no esté en uso
    if (userData.username && userData.username !== existingUser.username) {
      const existingUsername = await userRepository.findByUsername(userData.username);
      if (existingUsername) {
        throw new CustomError('El nombre de usuario ya está en uso.', 409);
      }
    }

    // Si se está actualizando la contraseña, hashearla
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password_hash = await bcrypt.hash(userData.password, salt);
      delete userData.password; // Remover la contraseña en texto plano
    }

    const result = await userRepository.update(id, userData);
    if (result.changedRows === 0) {
      throw new CustomError('No se pudo actualizar el usuario.', 400);
    }

    return await userRepository.findById(id);
  }

  async deleteUser(id) {
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new CustomError('Usuario no encontrado.', 404);
    }

    const result = await userRepository.delete(id);
    if (result.affectedRows === 0) {
      throw new CustomError('No se pudo eliminar el usuario.', 400);
    }

    return { message: 'Usuario eliminado exitosamente.' };
  }

  async reactivateUser(userId){
    const userFounded = await userRepository.findById(userId);
    if (!userFounded) {
      throw new CustomError('Usuario no encontrado.', 404);
    }

    if(userFounded.user_status === "ACTIVE"){
      throw new CustomError('El usuario se encuentra activo', 409);
    }

    const result = await userRepository.reactivateUser(userId);
    return result;
  }
}

export default new UserService(); 