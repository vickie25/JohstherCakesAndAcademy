const db = require('../config/database');

class Batch {
  static async findAll() {
    const query = 'SELECT * FROM academy_batches ORDER BY start_date ASC';
    const result = await db.query(query);
    return result.rows;
  }

  static async create(data) {
    const { name, start_date, price, status, status_color, course_name } = data;
    const query = `
      INSERT INTO academy_batches (name, start_date, price, status, status_color, course_name)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await db.query(query, [name, start_date, price, status, status_color, course_name]);
    return result.rows[0];
  }

  static async update(id, data) {
    const { name, start_date, price, status, status_color, course_name } = data;
    const query = `
      UPDATE academy_batches 
      SET name = $1, start_date = $2, price = $3, status = $4, status_color = $5, course_name = $6
      WHERE id = $7
      RETURNING *
    `;
    const result = await db.query(query, [name, start_date, price, status, status_color, course_name, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM academy_batches WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Batch;
