import db from '../config/db.js';

const mealPlanRepository = {
    async create(planData, connection) {
        const { client_id, professional_id, name, description, target_daily_calories, start_date, end_date } = planData;
        const query = `
            INSERT INTO MealPlan (client_id, professional_id, name, description, target_daily_calories, start_date, end_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [client_id, professional_id, name, description, target_daily_calories, start_date, end_date];
        const conn = connection || db;
        const [result] = await conn.query(query, params);
        return { id: result.insertId, ...planData };
    },

    async findById(planId, connection) {
        const query = 'SELECT * FROM MealPlan WHERE meal_plan_id = ?';
        const conn = connection || db;
        const [rows] = await conn.query(query, [planId]);
        return rows[0];
    },

    async findByClientId(clientId, connection) {
        const query = 'SELECT * FROM MealPlan WHERE client_id = ? ORDER BY start_date DESC';
        const conn = connection || db;
        const [rows] = await conn.query(query, [clientId]);
        return rows;
    },

    async update(planId, planData, connection) {
        const fieldsToUpdate = Object.keys(planData).map(key => `${key} = ?`).join(', ');
        if (fieldsToUpdate.length === 0) return 0;
        
        const query = `UPDATE MealPlan SET ${fieldsToUpdate} WHERE meal_plan_id = ?`;
        const params = [...Object.values(planData), planId];
        const conn = connection || db;
        const [result] = await conn.query(query, params);
        return result.affectedRows;
    },

    async delete(planId, connection) {
        const query = 'DELETE FROM MealPlan WHERE meal_plan_id = ?';
        const conn = connection || db;
        const [result] = await conn.query(query, [planId]);
        return result.affectedRows;
    }
};

export default mealPlanRepository; 