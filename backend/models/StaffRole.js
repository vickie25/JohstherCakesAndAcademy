const db = require('../config/database');

class StaffRole {
  static async findAll() {
    const result = await db.query(`
      SELECT r.*,
        COALESCE(
          (SELECT COUNT(*)::int FROM users u WHERE u.staff_role_id = r.id),
          0
        ) AS member_count
      FROM staff_roles r
      ORDER BY r.name ASC
    `);
    return result.rows.map((row) => ({
      ...row,
      permissions: StaffRole.normalizePermissions(row.permissions),
    }));
  }

  static async findById(id) {
    const result = await db.query(
      `
      SELECT r.*,
        COALESCE(
          (SELECT COUNT(*)::int FROM users u WHERE u.staff_role_id = r.id),
          0
        ) AS member_count
      FROM staff_roles r
      WHERE r.id = $1
    `,
      [id]
    );
    const row = result.rows[0];
    if (!row) return null;
    return {
      ...row,
      permissions: StaffRole.normalizePermissions(row.permissions),
    };
  }

  static normalizePermissions(raw) {
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === 'object') return Object.values(raw);
    if (typeof raw === 'string') {
      try {
        const p = JSON.parse(raw);
        return Array.isArray(p) ? p : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  static async create({ name, description, permissions }) {
    const query = `
      INSERT INTO staff_roles (name, description, permissions)
      VALUES ($1, $2, $3::jsonb)
      RETURNING *
    `;
    const result = await db.query(query, [
      name.trim(),
      (description || '').trim() || null,
      JSON.stringify(Array.isArray(permissions) ? permissions : []),
    ]);
    const row = result.rows[0];
    return { ...row, permissions: StaffRole.normalizePermissions(row.permissions), member_count: 0 };
  }

  static async update(id, { name, description, permissions }) {
    const query = `
      UPDATE staff_roles
      SET name = $1,
          description = $2,
          permissions = $3::jsonb,
          updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;
    const result = await db.query(query, [
      name.trim(),
      (description || '').trim() || null,
      JSON.stringify(Array.isArray(permissions) ? permissions : []),
      id,
    ]);
    const row = result.rows[0];
    if (!row) return null;
    return await this.findById(id);
  }

  static async delete(id) {
    const members = await db.query(
      'SELECT COUNT(*)::int AS c FROM users WHERE staff_role_id = $1',
      [id]
    );
    if (members.rows[0].c > 0) {
      const err = new Error('Cannot delete a role that is still assigned to team members.');
      err.status = 400;
      throw err;
    }
    const result = await db.query('DELETE FROM staff_roles WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }
}

module.exports = StaffRole;
