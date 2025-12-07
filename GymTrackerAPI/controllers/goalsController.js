import { GOALS_OPTIONS, isValidGoal, getGoalDisplayName } from '../constants/goals.js';

const goalsController = {
    // Obtener todas las opciones de goals disponibles
    async getGoalsOptions(req, res, next) {
        try {
            res.status(200).json({
                message: 'Goals options retrieved successfully',
                goals: GOALS_OPTIONS
            });
        } catch (error) {
            next(error);
        }
    },

    // Validar un goal específico
    async validateGoal(req, res, next) {
        try {
            const { goal } = req.params;
            
            const isValid = isValidGoal(goal);
            const displayName = isValid ? getGoalDisplayName(goal) : null;

            res.status(200).json({
                goal,
                isValid,
                displayName
            });
        } catch (error) {
            next(error);
        }
    }
};

export default goalsController;