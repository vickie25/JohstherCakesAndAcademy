const db = require('../config/database');

class Inquiry {
  static async findAll() {
    const query = 'SELECT * FROM inquiries ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows;
  }

  static async create(data) {
    const { name, email, phone, type, message } = data;
    const query = `
      INSERT INTO inquiries (name, email, phone, type, message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await db.query(query, [name, email, phone, type, message]);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING *';
    const result = await db.query(query, [status, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM inquiries WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Inquiry;
