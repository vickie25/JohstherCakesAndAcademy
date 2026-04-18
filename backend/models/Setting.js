const db = require('../config/database');

class Setting {
  static async findAll() {
    const query = 'SELECT key, value, updated_at FROM system_settings';
    const result = await db.query(query);
    // Convert array to object { key: value }
    return result.rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
  }

  static async findByKey(key) {
    const query = 'SELECT value FROM system_settings WHERE key = $1';
    const result = await db.query(query, [key]);
    return result.rows[0] ? result.rows[0].value : null;
  }

  static async update(key, value) {
    const query = `
      INSERT INTO system_settings (key, value, updated_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await db.query(query, [key, value]);
    return result.rows[0];
  }

  static async bulkUpdate(settingsMap) {
    const entries = Object.entries(settingsMap);
    const results = [];
    for (const [key, value] of entries) {
      const res = await this.update(key, value);
      results.push(res);
    }
    return results;
  }
}

module.exports = Setting;
