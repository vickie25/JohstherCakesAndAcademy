const db = require('../config/database');

class Testimonial {
  static async findAll(activeOnly = false) {
    let query = 'SELECT * FROM testimonials';
    if (activeOnly) query += ' WHERE is_active = true';
    query += ' ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows;
  }

  static async create(data) {
    const { name, role, content, rating, image_url, is_featured } = data;
    const query = `
      INSERT INTO testimonials (name, role, content, rating, image_url, is_featured)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await db.query(query, [name, role, content, rating, image_url, is_featured]);
    return result.rows[0];
  }

  static async update(id, data) {
    const { name, role, content, rating, image_url, is_featured, is_active } = data;
    const query = `
      UPDATE testimonials 
      SET name = $1, role = $2, content = $3, rating = $4, image_url = $5, is_featured = $6, is_active = $7
      WHERE id = $8
      RETURNING *
    `;
    const result = await db.query(query, [name, role, content, rating, image_url, is_featured, is_active, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM testimonials WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Testimonial;
