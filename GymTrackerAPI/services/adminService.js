import userRepository from '../repositories/userRepository.js';
import roleRepository from '../repositories/roleRepository.js';
import clientRepository from '../repositories/clientRepository.js';
import professionalRepository from '../repositories/professionalRepository.js';
import CustomError from '../utils/CustomError.js';

const adminService = {
    async getAllClientsWithGoals(userId) {
        // 1. Verificar que el usuario sea administrador
        const user = await userRepository.findById(userId);
        const role = await roleRepository.findById(user.role_id);
        
        if (role.name !== 'ADMINISTRATOR') {
            throw new CustomError('Only administrators can access this information.', 403);
        }

        // 2. Obtener todos los clientes con sus goals
        const clients = await clientRepository.findAllWithGoals();
        return clients;
    },

    async getClientGoalsById(userId, clientId) {
        // 1. Verificar que el usuario sea administrador
        const user = await userRepository.findById(userId);
        const role = await roleRepository.findById(user.role_id);
        
        if (role.name !== 'ADMINISTRATOR') {
            throw new CustomError('Only administrators can access this information.', 403);
        }

        // 2. Obtener información específica del cliente con goals
        const client = await clientRepository.findByIdWithGoals(clientId);
        if (!client) {
            throw new CustomError('Client not found.', 404);
        }

        return client;
    },

    async getAllProfessionalsWithClients(userId) {
        // 1. Verificar que el usuario sea administrador
        const user = await userRepository.findById(userId);
        const role = await roleRepository.findById(user.role_id);
        
        if (role.name !== 'ADMINISTRATOR') {
            throw new CustomError('Only administrators can access this information.', 403);
        }

        // 2. Obtener todos los profesionales con sus clientes asignados
        const professionals = await professionalRepository.findAllWithAssignedClients();
        return professionals;
    },

    async assignClientToProfessional(userId, clientId, professionalId) {
        // 1. Verificar que el usuario sea administrador
        const user = await userRepository.findById(userId);
        const role = await roleRepository.findById(user.role_id);
        
        if (role.name !== 'ADMINISTRATOR') {
            throw new CustomError('Only administrators can assign clients to professionals.', 403);
        }

        // 2. Verificar que el cliente existe
        const client = await clientRepository.findById(clientId);
        if (!client) {
            throw new CustomError('Client not found.', 404);
        }

        // 3. Verificar que el profesional existe
        const professional = await professionalRepository.findById(professionalId);
        if (!professional) {
            throw new CustomError('Professional not found.', 404);
        }

        // 4. Asignar cliente al profesional
        const result = await clientRepository.update(clientId, { 
            assigned_professional_id: professionalId 
        });

        if (result.changedRows === 0) {
            throw new CustomError('Failed to assign client to professional.', 400);
        }

        return {
            message: 'Client assigned to professional successfully.',
            client_id: clientId,
            professional_id: professionalId
        };
    },

    async getClientsByGoal(userId, goalType) {
        // 1. Verificar que el usuario sea administrador
        const user = await userRepository.findById(userId);
        const role = await roleRepository.findById(user.role_id);
        
        if (role.name !== 'ADMINISTRATOR') {
            throw new CustomError('Only administrators can access this information.', 403);
        }

        // 2. Obtener clientes filtrados por goal
        const clients = await clientRepository.findByGoal(goalType);
        return clients;
    }
};

export default adminService;