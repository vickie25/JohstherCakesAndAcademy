const db = require('../config/database');

class Registration {
  static async findAll() {
    const query = `
      SELECT r.*, b.name as batch_name 
      FROM registrations r
      LEFT JOIN academy_batches b ON r.batch_id = b.id
      ORDER BY r.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM registrations WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByBatchId(batchId) {
    const query = `
      SELECT r.*, b.name as batch_name
      FROM registrations r
      LEFT JOIN academy_batches b ON r.batch_id = b.id
      WHERE r.batch_id = $1
      ORDER BY r.created_at DESC
    `;
    const result = await db.query(query, [batchId]);
    return result.rows;
  }

  static async updateStatus(id, status, paymentStatus) {
    const query = `
      UPDATE registrations 
      SET status = COALESCE($1, status), 
          payment_status = COALESCE($2, payment_status)
      WHERE id = $3
      RETURNING *
    `;
    const result = await db.query(query, [status, paymentStatus, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM registrations WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Registration;
