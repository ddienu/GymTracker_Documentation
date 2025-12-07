import db from "../config/db.js";

const cartRepository = {
  async findByClientId(clientId, connection) {
    const query =
      `SELECT * FROM Cart WHERE client_id = ?`;
    const conn = connection || db;
    const [rows] = await conn.query(query, [clientId]);
    console.log(rows);
    return rows[0];
  },

  async findCartByProfileId(profileId, connection) {
    const query = `SELECT * FROM Cart t1
        INNER JOIN Client t2 ON t1.client_id = t2.client_id
        INNER JOIN Profile t3 ON t3.profile_id = t3.profile_id
        WHERE t3.profile_id = ?`;
    const conn = connection || db;
    const [rows] = await conn.query(query, [profileId]);
    return rows[0];
  },

  async create(clientId, connection) {
    const query = "INSERT INTO Cart (client_id) VALUES (?)";
    const conn = connection || db;
    const [result] = await conn.query(query, [clientId]);
    return { cart_id: result.insertId, client_id: clientId };
  },

  async findOrCreateByClientId(clientId, connection) {
    const conn = connection || db;
    let cart = await this.findByClientId(clientId, conn);
    if (!cart) {
      cart = await this.create(clientId, conn);
    }
    return cart;
  },
};

export default cartRepository;
