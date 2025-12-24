import jwt from 'jsonwebtoken';
import 'dotenv/config';

const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

if (!secret) {
  throw new Error('JWT_SECRET no está definida en las variables de entorno.');
}

/**
 * Genera un JSON Web Token (JWT).
 * @param {object} payload - El payload para incluir en el token (ej. { id, role }).
 * @returns {string} El token JWT generado.
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verifica un JSON Web Token (JWT).
 * @param {string} token - El token JWT a verificar.
 * @returns {object} El payload decodificado si el token es válido.
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null; // O puedes lanzar el error si prefieres un manejo más estricto
  }
};
