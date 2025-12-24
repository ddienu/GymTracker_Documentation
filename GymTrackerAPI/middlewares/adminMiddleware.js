import roleRepository from '../repositories/roleRepository.js';
import CustomError from '../utils/CustomError.js';

/**
 * Middleware para verificar que el usuario tenga rol de administrador
 */
const adminMiddleware = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        if (!userId) {
            throw new CustomError('Usuario no autenticado.', 401);
        }

        const userRoles = await roleRepository.findRolesByUserId(userId);
        const isAdmin = userRoles.some(role => role.name === 'ADMINISTRATOR');

        if (!isAdmin) {
            throw new CustomError('Acceso denegado. Se requieren permisos de administrador.', 403);
        }

        next();
    } catch (error) {
        next(error);
    }
};

export default adminMiddleware;