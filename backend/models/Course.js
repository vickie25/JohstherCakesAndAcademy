const db = require('../config/database');

class Course {
  static async findAll(activeOnly = false) {
    let query = 'SELECT * FROM courses';
    if (activeOnly) query += ' WHERE is_active = true';
    query += ' ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows;
  }

  static async create(data) {
    const { title, subtitle, price, duration, sessions, image_url, brand_color, features, tag } = data;
    const query = `
      INSERT INTO courses (title, subtitle, price, duration, sessions, image_url, brand_color, features, tag)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const result = await db.query(query, [
      title, subtitle, price, duration, sessions, image_url, brand_color, 
      JSON.stringify(features), tag
    ]);
    return result.rows[0];
  }

  static async update(id, data) {
    const { title, subtitle, price, duration, sessions, image_url, brand_color, features, tag, is_active } = data;
    const query = `
      UPDATE courses 
      SET title = $1, subtitle = $2, price = $3, duration = $4, sessions = $5, 
          image_url = $6, brand_color = $7, features = $8, tag = $9, is_active = $10
      WHERE id = $11
      RETURNING *
    `;
    const result = await db.query(query, [
      title, subtitle, price, duration, sessions, image_url, brand_color, 
      JSON.stringify(features), tag, is_active, id
    ]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM courses WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Course;
