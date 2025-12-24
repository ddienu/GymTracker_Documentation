import db from '../config/db.js';

const mealPlanMealRepository = {
    async create(mealData, connection) {
        const { meal_plan_id, meal_id, day_of_week, meal_type } = mealData;
        const query = `
            INSERT INTO MealPlan_Meal (meal_plan_id, meal_id, day_of_week, meal_type)
            VALUES (?, ?, ?, ?)
        `;
        const params = [meal_plan_id, meal_id, day_of_week, meal_type];
        const conn = connection || db;
        const [result] = await conn.query(query, params);
        return { id: result.insertId, ...mealData };
    },

    async findById(mealPlanMealId, connection) {
        const query = 'SELECT * FROM MealPlan_Meal WHERE meal_plan_meal_id = ?';
        const conn = connection || db;
        const [rows] = await conn.query(query, [mealPlanMealId]);
        return rows[0];
    },

    async findByPlanId(planId, connection) {
        const query = `
            SELECT mpm.*, m.name as meal_name, m.calories 
            FROM MealPlan_Meal mpm
            JOIN Meal m ON mpm.meal_id = m.meal_id
            WHERE mpm.meal_plan_id = ? 
            ORDER BY mpm.day_of_week, mpm.meal_type
        `;
        const conn = connection || db;
        const [rows] = await conn.query(query, [planId]);
        return rows;
    },

    async update(mealPlanMealId, mealData, connection) {
        const fieldsToUpdate = Object.keys(mealData).map(key => `${key} = ?`).join(', ');
        if (fieldsToUpdate.length === 0) return 0;
        
        const query = `UPDATE MealPlan_Meal SET ${fieldsToUpdate} WHERE meal_plan_meal_id = ?`;
        const params = [...Object.values(mealData), mealPlanMealId];
        const conn = connection || db;
        const [result] = await conn.query(query, params);
        return result.affectedRows;
    },

    async delete(mealPlanMealId, connection) {
        const query = 'DELETE FROM MealPlan_Meal WHERE meal_plan_meal_id = ?';
        const conn = connection || db;
        const [result] = await conn.query(query, [mealPlanMealId]);
        return result.affectedRows;
    }
};

export default mealPlanMealRepository; 