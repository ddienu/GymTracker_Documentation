import db from '../config/db.js';
import CustomError from '../utils/CustomError.js';
import roleRepository from '../repositories/roleRepository.js';
import clientRepository from '../repositories/clientRepository.js';
import availabilityRepository from '../repositories/availabilityRepository.js';
import appointmentRepository from '../repositories/appointmentRepository.js';
import professionalRepository from '../repositories/professionalRepository.js';
import orderServiceRepository from '../repositories/orderServiceRepository.js';
import serviceRepository from '../repositories/serviceRepository.js';
import { APPOINTMENT_ERRORS } from '../constants/errorMessages.js';
import Logger from '../utils/logger.js';

const appointmentService = {
    async createAppointment({ userId, availabilityId, serviceId }) {
        const connection = await db.getConnection();                                                                  
        await connection.beginTransaction();
        try {
            // 1. Verificar rol y obtener client_id
            const userRoles = await roleRepository.findRolesByUserId(userId, connection);
            if (!userRoles.some(role => role.name === 'CLIENT')) {
                throw new CustomError(APPOINTMENT_ERRORS.CLIENT_ROLE_REQUIRED, 403);
            }
            
            const client = await clientRepository.findByUserId(userId, connection);
            if (!client) {
                throw new CustomError(APPOINTMENT_ERRORS.CLIENT_PROFILE_NOT_FOUND, 404);
            }

            // 2. Verificar que el servicio existe y está activo
            const service = await serviceRepository.findById(serviceId);
            if (!service) {
                throw new CustomError(APPOINTMENT_ERRORS.SERVICE_NOT_FOUND, 404);
            }
            if (!service.is_active) {
                throw new CustomError('El servicio no está disponible actualmente.', 400);
            }

            // 3. Lógica de validación de créditos por conteo
            const purchasedCount = await orderServiceRepository.countPurchasedByClientAndService(client.client_id, serviceId, connection);
            const usedCount = await appointmentRepository.countUsedByClientAndService(client.client_id, serviceId, connection);

            if (purchasedCount <= usedCount) {
                throw new CustomError(APPOINTMENT_ERRORS.INSUFFICIENT_CREDITS, 403);
            }

            // 4. Verificar la disponibilidad del bloque
            const availability = await availabilityRepository.findById(availabilityId, connection);
            if (!availability) {
                throw new CustomError(APPOINTMENT_ERRORS.AVAILABILITY_NOT_FOUND, 404);
            }
            if (availability.is_booked) {
                throw new CustomError(APPOINTMENT_ERRORS.AVAILABILITY_TAKEN, 409);
            }

            // 5. Validar que no sea una fecha pasada
            const appointmentDate = new Date(availability.start_time);
            const now = new Date();
            if (appointmentDate < now) {
                throw new CustomError(APPOINTMENT_ERRORS.PAST_DATE_APPOINTMENT, 400);
            }

            // 6. Crear la cita (Appointment)
            const appointmentData = {
                client_id: client.client_id,
                professional_id: availability.professional_id,
                availability_id: availabilityId,
                service_id: serviceId,
                status: 'SCHEDULED'
            };
            const newAppointment = await appointmentRepository.create(appointmentData, connection);

            // 7. Marcar el bloque como reservado
            await availabilityRepository.update(availabilityId, { is_booked: true }, connection);
            
            await connection.commit();

            // Log de la operación exitosa
            Logger.appointmentOperation('CREATED', {
                appointmentId: newAppointment.insertId,
                clientId: client.client_id,
                professionalId: availability.professional_id,
                serviceId,
                availabilityId,
                userId
            });

            return {
                appointment_id: newAppointment.insertId,
                ...appointmentData
            };
            
        } catch (error) {
            await connection.rollback();
            Logger.error('Error creating appointment', error, {
                userId,
                availabilityId,
                serviceId
            });
            throw error;
        } finally {
            connection.release();
        }
    },

    async getAppointmentsForClient(userId) {
        const client = await clientRepository.findByUserId(userId);
        if (!client) {
            throw new CustomError(APPOINTMENT_ERRORS.CLIENT_PROFILE_NOT_FOUND, 404);
        }
        const appointments = await appointmentRepository.findAppointmentsByClientId(client.client_id);
        return appointments;
    },

    async getAppointmentsForProfessional(userId) {
        const userRoles = await roleRepository.findRolesByUserId(userId);
        if (!userRoles.some(role => role.name === 'PROFESSIONAL')) {
            throw new CustomError(APPOINTMENT_ERRORS.PROFESSIONAL_ROLE_REQUIRED, 403);
        }
        const professional = await professionalRepository.findByUserId(userId);
        if (!professional) {
            throw new CustomError(APPOINTMENT_ERRORS.PROFESSIONAL_PROFILE_NOT_FOUND, 404);
        }
        const appointments = await appointmentRepository.findAppointmentsByProfessionalId(professional.professional_id);
        return appointments;
    },

    async cancelAppointmentAsClient({ userId, appointmentId }) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const appointment = await appointmentRepository.findById(appointmentId, connection);
            if (!appointment) throw new CustomError(APPOINTMENT_ERRORS.APPOINTMENT_NOT_FOUND, 404);

            const client = await clientRepository.findByUserId(userId, connection);
            if (!client || appointment.client_id !== client.client_id) {
                throw new CustomError(APPOINTMENT_ERRORS.UNAUTHORIZED_CANCEL, 403);
            }

            if (appointment.status !== 'SCHEDULED') {
                throw new CustomError(APPOINTMENT_ERRORS.INVALID_STATUS_TRANSITION, 409);
            }

            await appointmentRepository.update(appointmentId, { status: 'CANCELLED_BY_CLIENT' }, connection);
            await availabilityRepository.update(appointment.availability_id, { is_booked: false }, connection);

            await connection.commit();

            // Log de la operación exitosa
            Logger.appointmentOperation('CANCELLED_BY_CLIENT', {
                appointmentId,
                clientId: client.client_id,
                userId
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async cancelAppointmentAsProfessional({ userId, appointmentId }) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const appointment = await appointmentRepository.findById(appointmentId, connection);
            if (!appointment) throw new CustomError(APPOINTMENT_ERRORS.APPOINTMENT_NOT_FOUND, 404);

            const professional = await professionalRepository.findByUserId(userId, connection);
            if (!professional || appointment.professional_id !== professional.professional_id) {
                throw new CustomError(APPOINTMENT_ERRORS.UNAUTHORIZED_CANCEL, 403);
            }

            if (appointment.status !== 'SCHEDULED') {
                throw new CustomError(APPOINTMENT_ERRORS.INVALID_STATUS_TRANSITION, 409);
            }

            await appointmentRepository.update(appointmentId, { status: 'CANCELLED_BY_PROFESSIONAL' }, connection);
            await availabilityRepository.update(appointment.availability_id, { is_booked: false }, connection);

            await connection.commit();

            // Log de la operación exitosa
            Logger.appointmentOperation('CANCELLED_BY_PROFESSIONAL', {
                appointmentId,
                professionalId: professional.professional_id,
                userId
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async completeAppointment({ userId, appointmentId }) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const userRoles = await roleRepository.findRolesByUserId(userId, connection);
            if (!userRoles.some(role => role.name === 'PROFESSIONAL')) {
                throw new CustomError(APPOINTMENT_ERRORS.PROFESSIONAL_ROLE_REQUIRED, 403);
            }

            const appointment = await appointmentRepository.findById(appointmentId, connection);
            if (!appointment) {
                throw new CustomError(APPOINTMENT_ERRORS.APPOINTMENT_NOT_FOUND, 404);
            }

            const professional = await professionalRepository.findByUserId(userId, connection);
            if (!professional || appointment.professional_id !== professional.professional_id) {
                throw new CustomError(APPOINTMENT_ERRORS.UNAUTHORIZED_COMPLETE, 403);
            }

            if (appointment.status !== 'SCHEDULED') {
                throw new CustomError(APPOINTMENT_ERRORS.INVALID_STATUS_TRANSITION, 409);
            }

            await appointmentRepository.update(appointmentId, { status: 'COMPLETED' }, connection);
            
            await connection.commit();

            // Log de la operación exitosa
            Logger.appointmentOperation('COMPLETED', {
                appointmentId,
                professionalId: professional.professional_id,
                userId
            });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async getAllAppointments() {
        return await appointmentRepository.findAll();
    },

    async getAppointmentById(appointmentId) {
        const appointment = await appointmentRepository.findById(appointmentId);
        if (!appointment) {
            throw new CustomError(APPOINTMENT_ERRORS.APPOINTMENT_NOT_FOUND, 404);
        }
        return appointment;
    },

    async updateAppointment(appointmentId, appointmentData) {
        const existingAppointment = await appointmentRepository.findById(appointmentId);
        if (!existingAppointment) {
            throw new CustomError(APPOINTMENT_ERRORS.APPOINTMENT_NOT_FOUND, 404);
        }
        
        const result = await appointmentRepository.update(appointmentId, appointmentData);
        if (result === 0) {
            throw new CustomError(APPOINTMENT_ERRORS.UPDATE_FAILED, 400);
        }

        return await appointmentRepository.findById(appointmentId);
    },

    async deleteAppointment(appointmentId) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const appointment = await appointmentRepository.findById(appointmentId, connection);
            if (!appointment) {
                throw new CustomError(APPOINTMENT_ERRORS.APPOINTMENT_NOT_FOUND, 404);
            }

            // Liberar la disponibilidad si la cita estaba programada
            if (appointment.status === 'SCHEDULED') {
                await availabilityRepository.update(appointment.availability_id, { is_booked: false }, connection);
            }

            // Eliminar la cita
            const result = await appointmentRepository.delete(appointmentId, connection);
            if (result.affectedRows === 0) {
                throw new CustomError(APPOINTMENT_ERRORS.DELETE_FAILED, 400);
            }

            await connection.commit();
            return { message: APPOINTMENT_ERRORS.APPOINTMENT_DELETED };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async cancelAppointment(appointmentId){
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try{
            const appointmentFounded = await appointmentRepository.cancelAppointmentByAdmin(appointmentId);
            if(!appointmentFounded.affectedRows){
                throw new CustomError(APPOINTMENT_ERRORS.APPOINTMENT_NOT_FOUND, 404);
            }

            return appointmentFounded;

        }catch(error){
            await connection.rollback();
            throw error;
        }finally{
            connection.release();
        }
    }
};

export default appointmentService; 