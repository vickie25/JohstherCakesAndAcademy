const db = require('../config/database');
const CourseLesson = require('./CourseLesson');

class Course {
  static async findAll(activeOnly = false) {
    let query = 'SELECT * FROM courses';
    if (activeOnly) query += ' WHERE is_active = true';
    query += ' ORDER BY created_at DESC';
    const result = await db.query(query);
    const courses = result.rows;
    if (!courses.length) return courses;
    const lessons = await CourseLesson.findByCourseIds(courses.map((c) => c.id));
    const byCourse = {};
    for (const row of lessons) {
      if (!byCourse[row.course_id]) byCourse[row.course_id] = [];
      byCourse[row.course_id].push({
        id: row.id,
        title: row.title,
        video_url: row.video_url,
        sort_order: row.sort_order,
      });
    }
    return courses.map((c) => ({ ...c, lessons: byCourse[c.id] || [] }));
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM courses WHERE id = $1', [id]);
    const course = result.rows[0];
    if (!course) return null;
    const lessons = await CourseLesson.findByCourseId(id);
    return { ...course, lessons };
  }

  static async create(data) {
    const { title, subtitle, price, duration, sessions, image_url, brand_color, features, tag, promo_video_url, delivery_type } = data;
    const mode = delivery_type === 'physical' ? 'physical' : 'online';
    const query = `
      INSERT INTO courses (title, subtitle, price, duration, sessions, image_url, brand_color, features, tag, promo_video_url, delivery_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const result = await db.query(query, [
      title, subtitle, price, duration, sessions, image_url, brand_color,
      JSON.stringify(features || []), tag, promo_video_url || null, mode,
    ]);
    return result.rows[0];
  }

  static async update(id, data) {
    const { title, subtitle, price, duration, sessions, image_url, brand_color, features, tag, is_active, promo_video_url, delivery_type } = data;
    const mode = delivery_type === 'physical' ? 'physical' : 'online';
    const query = `
      UPDATE courses 
      SET title = $1, subtitle = $2, price = $3, duration = $4, sessions = $5, 
          image_url = $6, brand_color = $7, features = $8, tag = $9, is_active = $10,
          promo_video_url = $11, delivery_type = $12,
          updated_at = NOW()
      WHERE id = $13
      RETURNING *
    `;
    const result = await db.query(query, [
      title, subtitle, price, duration, sessions, image_url, brand_color,
      JSON.stringify(features || []), tag, is_active,
      promo_video_url ?? null,
      mode,
      id,
    ]);
    return result.rows[0];
  }

  static async setImageUrl(id, image_url) {
    const result = await db.query(
      'UPDATE courses SET image_url = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [image_url, id]
    );
    return result.rows[0];
  }

  static async setPromoVideoUrl(id, promo_video_url) {
    const result = await db.query(
      'UPDATE courses SET promo_video_url = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [promo_video_url, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM courses WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Course;
