const db = require('../config/database');

class CourseLesson {
  static async findByCourseId(courseId) {
    const result = await db.query(
      'SELECT id, course_id, title, video_url, sort_order, created_at FROM course_lessons WHERE course_id = $1 ORDER BY sort_order ASC, id ASC',
      [courseId]
    );
    return result.rows;
  }

  static async findByCourseIds(courseIds) {
    if (!courseIds.length) return [];
    const result = await db.query(
      'SELECT id, course_id, title, video_url, sort_order FROM course_lessons WHERE course_id = ANY($1::int[]) ORDER BY course_id, sort_order ASC, id ASC',
      [courseIds]
    );
    return result.rows;
  }

  static async create({ course_id, title, video_url, sort_order = 0 }) {
    const result = await db.query(
      `INSERT INTO course_lessons (course_id, title, video_url, sort_order)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [course_id, title, video_url, sort_order]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM course_lessons WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }
}

module.exports = CourseLesson;
