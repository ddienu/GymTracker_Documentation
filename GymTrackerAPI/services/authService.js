import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import userRepository from '../repositories/userRepository.js';
import profileRepository from '../repositories/profileRepository.js';
import clientRepository from '../repositories/clientRepository.js';
import { generateToken } from '../utils/jwt.js';
import roleRepository from '../repositories/roleRepository.js';
import administratorRepository from '../repositories/administratorRepository.js';
import CustomError from '../utils/CustomError.js';

class AuthService {
  async register(userData) {
    // Si no se especifica un rol, se asume que es 'CLIENT'
    const role_name = userData.role_name || 'CLIENT';

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Validar que el rol exista y obtener su ID
      const role = await roleRepository.findByName(role_name, connection);
      if (!role) {
        const error = new Error('Invalid role specified.');
        error.statusCode = 400;
        throw error;
      }

      // 2. Validar que la contraseña cumpla con las condiciones
      const regExp = /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

      if(!regExp.test(userData.password)){
        const error = new Error('Contraseña inválida');
        error.statusCode = 400;
        throw error;
      }

      // 3. Validar que la fecha de nacimiento ingresada sea de al menos 15 años.
      const actualYear = new Date().getFullYear();
      
      if(userData.birth_date.split('-')[0] > actualYear - 15){
        const error = new Error('La edad mínima de registro es 15 años');
        error.statusCode = 400;
        throw error;
      }
      

      // 4. Hashear la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);


      // 5. Crear el User
      const newUser = {
        username: userData.username,
        password_hash: hashedPassword,
        role_id: role.role_id,
      };
      const createdUser = await userRepository.create(newUser, connection);
      const userId = createdUser.user_id;

      // 6. Crear el Profile
      const newProfile = {
        user_id: userId,
        document_number: userData.document_number,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        birth_date: userData.birth_date,
        gender: userData.gender,
        weight_kg: userData.weight_kg,
        height_cm: userData.height_cm,
        goals: userData.goals,
      };
      const createdProfile = await profileRepository.create(newProfile, connection);

      // 7. Si el rol es 'CLIENT', crear la entidad Client asociada
      if (role.name === 'CLIENT') {
        await clientRepository.create({ profile_id: createdProfile.profile_id }, connection);
      }

      await connection.commit();

      // Devolver el perfil creado, que es más informativo
      return createdProfile;

    } catch (error) {
      await connection.rollback();
      // Añadir un chequeo para errores de duplicados
      console.log(error);
      if (error.code === 'ER_DUP_ENTRY') {
        const dupError = new Error('Username, email or document number already exists.');
        dupError.statusCode = 409; // 409 Conflict
        throw dupError;
      }
      throw error;
    } finally {
      connection.release();
    }
  }

  async login({ email, password }) {
    // 1. Buscar al usuario por su email
    const user = await userRepository.findByEmail(email);
    console.log(user);

    if (!user) {
      throw new CustomError('Invalid credentials.', 401);
    }
    
    if(user.user_status === "INACTIVE"){
      throw new CustomError("Usuario desactivado, contacte a un administrador", 403);
    }

    // 2. Comparar la contraseña proporcionada con el hash almacenado
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new CustomError('Invalid credentials.', 401);
    }

    

    let isAdmin = false;
    if (user.role_name === 'ADMINISTRATOR') {
      const adminRecord = await administratorRepository.findByProfileId(user.profile_id);
      if (adminRecord) {
        isAdmin = true;
      }
    }

    // 3. Generar el token JWT con el payload correcto
    const payload = {
      id: user.user_id,
      username: user.username,
      role: user.role_name,
      isAdmin,
    };

    const token = generateToken(payload);

    // 4. Devolver los datos del usuario y el token
    // Eliminamos el hash de la contraseña de la respuesta por seguridad
    delete user.password_hash;

    return {
      message: 'Login successful',
      user,
      token
    };
  }
}

export default new AuthService(); 