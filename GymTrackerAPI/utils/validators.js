import CustomError from "./CustomError.js";

/**
 * Utilidades de validación para el sistema de citas
 */
export const validators = {
  /**
   * Valida que un ID sea un número entero positivo
   * @param {any} id - El ID a validar
   * @param {string} fieldName - Nombre del campo para el mensaje de error
   * @returns {number} El ID validado
   */
  validatePositiveInteger(id, fieldName = "ID") {
    const parsedId = parseInt(id);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      throw new CustomError(
        `${fieldName} debe ser un número entero positivo.`,
        400
      );
    }

    return parsedId;
  },

  /**
   * Valida que los campos requeridos estén presentes
   * @param {object} data - Objeto con los datos
   * @param {string[]} requiredFields - Array de campos requeridos
   */
  validateRequiredFields(data, requiredFields) {
    const missingFields = requiredFields.filter(
      (field) =>
        data[field] === undefined || data[field] === null || data[field] === ""
    );

    if (missingFields.length > 0) {
      throw new CustomError(
        `Los siguientes campos son requeridos: ${missingFields.join(", ")}.`,
        400
      );
    }
  },

  /**
   * Valida que un objeto no esté vacío
   * @param {object} data - Objeto a validar
   * @param {string} message - Mensaje de error personalizado
   */
  validateNotEmpty(data, message = "No se enviaron datos para procesar.") {
    if (!data || Object.keys(data).length === 0) {
      throw new CustomError(message, 400);
    }
  },

  /**
   * Valida que una fecha no sea en el pasado
   * @param {Date|string} date - Fecha a validar
   * @param {string} fieldName - Nombre del campo para el mensaje de error
   */
  validateFutureDate(date, fieldName = "fecha") {
    const dateObj = new Date(date);
    const now = new Date();

    if (isNaN(dateObj.getTime())) {
      throw new CustomError(`${fieldName} debe ser una fecha válida.`, 400);
    }

    if (dateObj < now) {
      throw new CustomError(`${fieldName} no puede ser en el pasado.`, 400);
    }
  },

  /**
   * Valida estados de cita válidos
   * @param {string} status - Estado a validar
   */
  validateAppointmentStatus(status) {
    const validStatuses = [
      "SCHEDULED",
      "COMPLETED",
      "CANCELLED_BY_CLIENT",
      "CANCELLED_BY_PROFESSIONAL",
      "NO_SHOW",
    ];

    if (!validStatuses.includes(status)) {
      throw new CustomError(
        `Estado inválido. Estados válidos: ${validStatuses.join(", ")}.`,
        400
      );
    }
  },

  /**
   * Sanitiza y valida datos de actualización de cita
   * @param {object} updateData - Datos de actualización
   * @returns {object} Datos sanitizados
   */
  sanitizeAppointmentUpdateData(updateData) {
    const allowedFields = [
      "status",
      "start_time",
      "end_time",
      "cancel_reason",
      "cancelled_at",
      "cancelled_by",
      "booked_by",
      "notes",
    ];
    const sanitized = {};

    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        sanitized[key] = updateData[key];
      }
    });

    if (sanitized.status) {
      this.validateAppointmentStatus(sanitized.status);
    }

    return sanitized;
  },
};

export default validators;
