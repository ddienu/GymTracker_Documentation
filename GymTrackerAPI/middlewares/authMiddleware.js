import { verifyToken } from '../utils/jwt.js';

const authMiddleware = (req, res, next) => {
  // 1. Obtener el token del encabezado de autorización
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }

  // Añadir la información del usuario decodificada al objeto `req`
  req.user = decoded; // ej: { id: 1, role: 'ADMINISTRATOR', isAdmin: true }

  // Pasar al siguiente middleware o controlador
  next();
};

export default authMiddleware;
