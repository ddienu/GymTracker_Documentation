/**
 * Middleware para el manejo centralizado de errores.
 * Captura los errores que ocurren en la aplicación y envía una respuesta JSON estandarizada.
 * 
 * @param {Error} err - El objeto de error.
 * @param {object} req - El objeto de solicitud de Express.
 * @param {object} res - El objeto de respuesta de Express.
 * @param {function} next - La función para pasar al siguiente middleware.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Determina el código de estado. Si el error tiene un statusCode, úsalo; si no, usa 500.
  const statusCode = err.statusCode || 500;

  // Determina el mensaje de error.
  const message = err.message || 'Ha ocurrido un error inesperado en el servidor.';

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    // Opcional: en desarrollo, puedes incluir el stack del error.
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler; 