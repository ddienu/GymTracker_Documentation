import appointmentService from '../services/appointmentService.js';
import CustomError from '../utils/CustomError.js';
import validators from '../utils/validators.js';
import { APPOINTMENT_ERRORS } from '../constants/errorMessages.js';

const appointmentController = {
    async createAppointment(req, res, next) {
        try {
            const { availabilityId, serviceId } = req.body;
            const userId = req.user.id;

            // Validar campos requeridos
            validators.validateRequiredFields(req.body, ['availabilityId', 'serviceId']);

            // Validar que sean números enteros positivos
            const validatedAvailabilityId = validators.validatePositiveInteger(availabilityId, 'availabilityId');
            const validatedServiceId = validators.validatePositiveInteger(serviceId, 'serviceId');

            const appointment = await appointmentService.createAppointment({ 
                userId, 
                availabilityId: validatedAvailabilityId, 
                serviceId: validatedServiceId 
            });
            
            res.status(201).json(appointment);
        } catch (error) {
            next(error);
        }
    },

    async getAppointmentsForClient(req, res, next) {
        try {
            const { id: userId } = req.user; // ID del cliente autenticado
            
            const appointments = await appointmentService.getAppointmentsForClient(userId);

            res.status(200).json(appointments);
        } catch (error) {
            next(error);
        }
    },

    async getAppointmentsForProfessional(req, res, next) {
        try {
            const { id: userId } = req.user; // ID del profesional autenticado
            
            const appointments = await appointmentService.getAppointmentsForProfessional(userId);

            res.status(200).json(appointments);
        } catch (error) {
            next(error);
        }
    },

    async cancelAppointmentAsClient(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { id: appointmentId } = req.params;

            // Validar que el appointmentId sea un número entero positivo
            const validatedAppointmentId = validators.validatePositiveInteger(appointmentId, 'appointmentId');

            await appointmentService.cancelAppointmentAsClient({ userId, appointmentId: validatedAppointmentId });

            res.status(200).json({ message: APPOINTMENT_ERRORS.APPOINTMENT_CANCELLED });
        } catch (error) {
            next(error);
        }
    },

    async cancelAppointmentAsProfessional(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { id: appointmentId } = req.params;

            // Validar que el appointmentId sea un número entero positivo
            const validatedAppointmentId = validators.validatePositiveInteger(appointmentId, 'appointmentId');

            await appointmentService.cancelAppointmentAsProfessional({ userId, appointmentId: validatedAppointmentId });

            res.status(200).json({ message: APPOINTMENT_ERRORS.APPOINTMENT_CANCELLED_BY_PROFESSIONAL });
        } catch (error) {
            next(error);
        }
    },

    async completeAppointment(req, res, next) {
        try {
            const { id: appointmentId } = req.params;
            const userId = req.user.id;

            // Validar que el appointmentId sea un número entero positivo
            const validatedAppointmentId = validators.validatePositiveInteger(appointmentId, 'appointmentId');

            await appointmentService.completeAppointment({ userId, appointmentId: validatedAppointmentId });

            res.status(200).json({ message: APPOINTMENT_ERRORS.APPOINTMENT_COMPLETED });
        } catch (error) {
            next(error);
        }
    },

    async getAllAppointments(req, res, next) {
        try {
            const appointments = await appointmentService.getAllAppointments();
            res.status(200).json(appointments);
        } catch (error) {
            next(error);
        }
    },

    async getAppointmentById(req, res, next) {
        try {
            const { id } = req.params;
            
            // Validar que el ID sea un número entero positivo
            const validatedId = validators.validatePositiveInteger(id, 'appointmentId');
            
            const appointment = await appointmentService.getAppointmentById(validatedId);
            res.status(200).json(appointment);
        } catch (error) {
            next(error);
        }
    },

    async updateAppointment(req, res, next) {
        try {
            const id  = req.params.appointmentId;
            const appointmentData = req.body;
            
            // Validar que el ID sea un número entero positivo
            const validatedId = validators.validatePositiveInteger(id, 'appointmentId');

            // Validar que se enviaron datos para actualizar
            validators.validateNotEmpty(appointmentData, APPOINTMENT_ERRORS.NO_UPDATE_DATA);

            // Sanitizar y validar datos de actualización
            const sanitizedData = validators.sanitizeAppointmentUpdateData(appointmentData);

            const updatedAppointment = await appointmentService.updateAppointment(validatedId, sanitizedData);
            res.status(200).json({ 
                message: APPOINTMENT_ERRORS.APPOINTMENT_UPDATED, 
                appointment: updatedAppointment 
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteAppointment(req, res, next) {
        try {
            const { id } = req.params;
            
            // Validar que el ID sea un número entero positivo
            const validatedId = validators.validatePositiveInteger(id, 'appointmentId');
            
            const result = await appointmentService.deleteAppointment(validatedId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    async cancelAppointment(req,res,next){
        try{
            const appointmentId = req.params.appointmentId;
            if(!appointmentId){
                return res.status(400).json({
                    message: "AppointmentId is required"
                });
            }

            const result = await appointmentService.cancelAppointment(appointmentId);
            return res.status(200).json({
                message: "Appointment cancelled successfully"
            });

        }catch(error){
            next(error);
        }
    }
};

export default appointmentController; 