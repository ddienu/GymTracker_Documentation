import authService from '../services/authService.js';
import { isValidGoal } from '../constants/goals.js';

const authController = {
    async register(req, res, next) {
        try {
            // Extraemos todos los datos necesarios del body
            const {
                username,
                password,
                role_name, // 'CLIENT', 'PROFESSIONAL', etc.
                document_number,
                first_name,
                last_name,
                email,
                birth_date,
                gender,
                weight_kg,
                height_cm,
                goals
            } = req.body;

            // Creamos un objeto con los datos del usuario para el servicio
            const userData = {
                username,
                password,
                role_name,
                document_number,
                first_name,
                last_name,
                email,
                birth_date,
                gender,
                weight_kg,
                height_cm,
                goals
            };

            console.log(userData.document_number);

            if( userData.document_number === null || userData.document_number === "" || userData.document_number === undefined){
                return res.status(400).json({
                    message: "Document number is null"
                });
            }

            // Validar goal si se proporciona
            if (userData.goals && !isValidGoal(userData.goals)) {
                return res.status(400).json({
                    message: "Invalid goal selected. Please choose from available options."
                });
            }

            const newUser = await authService.register(userData);

            res.status(201).json({
                message: 'User registered successfully',
                user: newUser
            });
        } catch (error) {
            next(error);
        }
    },

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                const error = new Error('Email and password are required.');
                error.statusCode = 400;
                throw error;
            }

            const result = await authService.login({ email, password });
            res.status(200).json(result);

        } catch (error) {
            next(error);
        }
    }
};

export default authController; 