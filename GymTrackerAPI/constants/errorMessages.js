/**
 * Constantes para mensajes de error del módulo de citas
 */
export const APPOINTMENT_ERRORS = {
    // Errores de validación
    REQUIRED_FIELDS: 'availabilityId y serviceId son requeridos.',
    INVALID_AVAILABILITY_ID: 'availabilityId debe ser un número entero positivo.',
    INVALID_SERVICE_ID: 'serviceId debe ser un número entero positivo.',
    INVALID_APPOINTMENT_ID: 'appointmentId debe ser un número entero positivo.',
    NO_UPDATE_DATA: 'No se enviaron datos para actualizar.',
    
    // Errores de autorización
    CLIENT_ROLE_REQUIRED: 'Solo usuarios con rol CLIENT pueden reservar citas.',
    PROFESSIONAL_ROLE_REQUIRED: 'Solo usuarios con rol PROFESSIONAL pueden acceder a esta funcionalidad.',
    ADMIN_ROLE_REQUIRED: 'Se requieren permisos de administrador para esta operación.',
    UNAUTHORIZED_CANCEL: 'No tienes autorización para cancelar esta cita.',
    UNAUTHORIZED_COMPLETE: 'No tienes autorización para completar esta cita.',
    
    // Errores de recursos no encontrados
    CLIENT_PROFILE_NOT_FOUND: 'Perfil de cliente no encontrado para este usuario.',
    PROFESSIONAL_PROFILE_NOT_FOUND: 'Perfil de profesional no encontrado para este usuario.',
    APPOINTMENT_NOT_FOUND: 'Cita no encontrada.',
    AVAILABILITY_NOT_FOUND: 'Bloque de disponibilidad no encontrado.',
    SERVICE_NOT_FOUND: 'Servicio no encontrado.',
    
    // Errores de lógica de negocio
    INSUFFICIENT_CREDITS: 'No tienes créditos disponibles para agendar este servicio. Por favor, realiza la compra primero.',
    AVAILABILITY_TAKEN: 'Este horario ya no está disponible.',
    PAST_DATE_APPOINTMENT: 'No se pueden agendar citas en el pasado.',
    INVALID_STATUS_TRANSITION: 'No se puede realizar esta operación con el estado actual de la cita.',
    SERVICE_NOT_OFFERED: 'El profesional no ofrece este servicio.',
    
    // Errores de operaciones
    UPDATE_FAILED: 'No se pudo actualizar la cita.',
    DELETE_FAILED: 'No se pudo eliminar la cita.',
    CREATION_FAILED: 'No se pudo crear la cita.',
    
    // Mensajes de éxito
    APPOINTMENT_CANCELLED: 'Cita cancelada exitosamente.',
    APPOINTMENT_CANCELLED_BY_PROFESSIONAL: 'Cita cancelada exitosamente por el profesional.',
    APPOINTMENT_COMPLETED: 'Cita marcada como completada exitosamente.',
    APPOINTMENT_UPDATED: 'Cita actualizada con éxito.',
    APPOINTMENT_DELETED: 'Cita eliminada exitosamente.'
};

export default APPOINTMENT_ERRORS;