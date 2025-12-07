import professionalRepository from '../repositories/professionalRepository.js';
import availabilityRepository from '../repositories/availabilityRepository.js';

const availabilityService = {
    async addAvailability(userId, slotData) {
        // 1. Obtener el perfil profesional del usuario
        const professional = await professionalRepository.findByUserId(userId);
        if (!professional) {
            const error = new Error('Only a registered professional can add availability.');
            error.statusCode = 403; // Forbidden
            throw error;
        }

        // 2. Validar las fechas
        const { start_time, end_time } = slotData;
        if (!start_time || !end_time || new Date(start_time) >= new Date(end_time)) {
            const error = new Error('Invalid time slot. Start time must be before end time.');
            error.statusCode = 400; // Bad Request
            throw error;
        }

        // 3. Crear el nuevo bloque de disponibilidad
        const newSlotData = {
            professional_id: professional.professional_id,
            start_time,
            end_time
        };

        const newSlot = await availabilityRepository.create(newSlotData);
        return newSlot;
    },

    async getMyAvailability(userId) {
        // 1. Obtener el perfil profesional del usuario
        const professional = await professionalRepository.findByUserId(userId);
        if (!professional) {
            const error = new Error('Only a registered professional can view availability.');
            error.statusCode = 403; // Forbidden
            throw error;
        }

        // 2. Obtener todos los bloques de disponibilidad para ese profesional
        const slots = await availabilityRepository.findByProfessionalId(professional.professional_id);
        return slots;
    },

    async deleteAvailability(userId, availabilityId) {
        // 1. Obtener el perfil profesional para verificación de propiedad
        const professional = await professionalRepository.findByUserId(userId);
        if (!professional) {
            const error = new Error('Professional not found.');
            error.statusCode = 403;
            throw error;
        }

        // 2. Obtener el bloque de disponibilidad a eliminar
        const slotToDelete = await availabilityRepository.findById(availabilityId);
        if (!slotToDelete) {
            const error = new Error('Availability slot not found.');
            error.statusCode = 404;
            throw error;
        }

        // 3. Verificar que el profesional sea el dueño del bloque
        if (slotToDelete.professional_id !== professional.professional_id) {
            const error = new Error('Forbidden. You can only delete your own availability slots.');
            error.statusCode = 403;
            throw error;
        }

        // 4. Verificar que el bloque no esté reservado
        if (slotToDelete.is_booked) {
            const error = new Error('Cannot delete a slot that is already booked.');
            error.statusCode = 409; // Conflict
            throw error;
        }

        // 5. Eliminar el bloque
        await availabilityRepository.delete(availabilityId);
    }
};

export default availabilityService; 