const db = require('../config/database');

class Cake {
  static async findAll(activeOnly = false) {
    let query = 'SELECT * FROM cakes';
    if (activeOnly) query += ' WHERE is_active = true';
    query += ' ORDER BY created_at DESC';
    
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM cakes WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async create(cakeData) {
    const { name, category, color, price, image_url, tag, description } = cakeData;
    const query = `
      INSERT INTO cakes (name, category, color, price, image_url, tag, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await db.query(query, [name, category, color, price, image_url, tag, description]);
    return result.rows[0];
  }

  static async update(id, cakeData) {
    const { name, category, color, price, image_url, tag, description, is_active } = cakeData;
    const query = `
      UPDATE cakes 
      SET name = $1, category = $2, color = $3, price = $4, image_url = $5, tag = $6, description = $7, is_active = $8, updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `;
    const result = await db.query(query, [name, category, color, price, image_url, tag, description, is_active, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM cakes WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Cake;
