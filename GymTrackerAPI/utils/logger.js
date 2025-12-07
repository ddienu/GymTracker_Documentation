/**
 * Utilidad de logging para el sistema de citas
 */
class Logger {
    /**
     * Log de información general
     * @param {string} message - Mensaje a loggear
     * @param {object} data - Datos adicionales
     */
    static info(message, data = {}) {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data);
    }

    /**
     * Log de errores
     * @param {string} message - Mensaje de error
     * @param {Error} error - Objeto de error
     * @param {object} data - Datos adicionales
     */
    static error(message, error = null, data = {}) {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, {
            error: error?.message,
            stack: error?.stack,
            ...data
        });
    }

    /**
     * Log de operaciones de citas
     * @param {string} operation - Tipo de operación
     * @param {object} data - Datos de la operación
     */
    static appointmentOperation(operation, data) {
        this.info(`APPOINTMENT_${operation.toUpperCase()}`, {
            operation,
            timestamp: new Date().toISOString(),
            ...data
        });
    }

    /**
     * Log de transacciones de base de datos
     * @param {string} operation - Operación de BD
     * @param {object} data - Datos de la transacción
     */
    static dbTransaction(operation, data) {
        this.info(`DB_TRANSACTION_${operation.toUpperCase()}`, {
            operation,
            timestamp: new Date().toISOString(),
            ...data
        });
    }
}

export default Logger;