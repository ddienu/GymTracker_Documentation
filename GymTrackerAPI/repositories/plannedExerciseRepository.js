import db from '../config/db.js';

const plannedExerciseRepository = {
    async create(exerciseData, connection) {
        const { plan_id, exercise_id, day_of_week, sets, repetitions, rest_seconds, notes } = exerciseData;
        const query = `
            INSERT INTO PlannedExercise (plan_id, exercise_id, day_of_week, sets, repetitions, rest_seconds, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [plan_id, exercise_id, day_of_week, sets, repetitions, rest_seconds, notes];
        const conn = connection || db;
        const [result] = await conn.query(query, params);
        return { id: result.insertId, ...exerciseData };
    },

    async findById(plannedExerciseId, connection) {
        const query = 'SELECT * FROM PlannedExercise WHERE planned_exercise_id = ?';
        const conn = connection || db;
        const [rows] = await conn.query(query, [plannedExerciseId]);
        return rows[0];
    },

    async findByPlanId(planId, connection) {
        const query = `
            SELECT pe.*, e.name as exercise_name 
            FROM PlannedExercise pe
            JOIN Exercise e ON pe.exercise_id = e.exercise_id
            WHERE pe.plan_id = ? 
            ORDER BY pe.day_of_week
        `;
        const conn = connection || db;
        const [rows] = await conn.query(query, [planId]);
        return rows;
    },

    async update(plannedExerciseId, exerciseData, connection) {
        const fieldsToUpdate = Object.keys(exerciseData).map(key => `${key} = ?`).join(', ');
        if (fieldsToUpdate.length === 0) return 0;
        
        const query = `UPDATE PlannedExercise SET ${fieldsToUpdate} WHERE planned_exercise_id = ?`;
        const params = [...Object.values(exerciseData), plannedExerciseId];
        const conn = connection || db;
        const [result] = await conn.query(query, params);
        return result.affectedRows;
    },

    async delete(plannedExerciseId, connection) {
        const query = 'DELETE FROM PlannedExercise WHERE planned_exercise_id = ?';
        const conn = connection || db;
        const [result] = await conn.query(query, [plannedExerciseId]);
        return result.affectedRows;
    }
};

export default plannedExerciseRepository; 