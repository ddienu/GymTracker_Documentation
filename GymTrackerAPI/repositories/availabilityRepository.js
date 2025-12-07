import db from '../config/db.js';

const availabilityRepository = {
    async create(slotData) {
        const { professional_id, start_time, end_time } = slotData;
        const query = 'INSERT INTO ProfessionalAvailability (professional_id, start_time, end_time) VALUES (?, ?, ?)';
        
        const [result] = await db.query(query, [professional_id, start_time, end_time]);
        
        return { 
            availability_id: result.insertId,
             ...slotData 
        };
    },

    async findByProfessionalId(professionalId) {
        const query = 'SELECT * FROM ProfessionalAvailability WHERE professional_id = ? ORDER BY start_time ASC';
        const [rows] = await db.query(query, [professionalId]);
        return rows;
    },

    async findById(id) {
        const query = 'SELECT * FROM ProfessionalAvailability WHERE availability_id = ?';
        const [rows] = await db.query(query, [id]);
        return rows[0];
    },

    async delete(id, connection) {
        const query = 'DELETE FROM ProfessionalAvailability WHERE availability_id = ?';
        const conn = connection || db;
        const [result] = await conn.query(query, [id]);
        return result.affectedRows;
    },

    async update(id, fields, connection) {
        const setClauses = Object.keys(fields).map(key => `${key} = ?`).join(', ');
        if (setClauses.length === 0) {
            return 0;
        }

        const query = `UPDATE ProfessionalAvailability SET ${setClauses} WHERE availability_id = ?`;
        const params = [...Object.values(fields), id];
        
        const conn = connection || db;
        const [result] = await conn.query(query, params);
        return result.affectedRows;
    }
};

export default availabilityRepository; 