const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const CourseLesson = require('../models/CourseLesson');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { uploadCourseThumbnail, uploadCourseVideo } = require('../middleware/courseUploads');

const publicFileUrl = (filename) => `/uploads/courses/${filename}`;

const runUpload = (uploadMiddleware) => (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || 'Upload failed' });
    }
    next();
  });
};

// @route   GET /api/courses
// @desc    Get all courses (includes lessons[])
// @access  Public
router.get('/', async (req, res) => {
  try {
    const activeOnly = req.query.active !== 'false';
    const courses = await Course.findAll(activeOnly);
    res.json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get one course with lessons
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid course id' });
    }
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/courses
// @desc    Add new course (JSON body)
// @access  Private/Admin
router.post('/', [auth, isAdmin], async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/courses/:id/thumbnail
// @desc    Upload course cover image (field name: thumbnail)
// @access  Private/Admin
router.post(
  '/:id/thumbnail',
  [auth, isAdmin, runUpload(uploadCourseThumbnail.single('thumbnail'))],
  async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid course id' });
      }
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      const url = publicFileUrl(req.file.filename);
      const course = await Course.setImageUrl(id, url);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
      res.json({ success: true, data: { image_url: url, course } });
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// @route   POST /api/courses/:id/promo-video
// @desc    Upload course intro / promo video (field name: promo)
// @access  Private/Admin
router.post(
  '/:id/promo-video',
  [auth, isAdmin, runUpload(uploadCourseVideo.single('promo'))],
  async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid course id' });
      }
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      const url = publicFileUrl(req.file.filename);
      const course = await Course.setPromoVideoUrl(id, url);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
      res.json({ success: true, data: { promo_video_url: url, course } });
    } catch (error) {
      console.error('Promo video upload error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// @route   POST /api/courses/:id/lessons
// @desc    Upload a lesson video (multipart: title, sort_order, video)
// @access  Private/Admin
router.post(
  '/:id/lessons',
  [auth, isAdmin, runUpload(uploadCourseVideo.single('video'))],
  async (req, res) => {
    try {
      const courseId = parseInt(req.params.id, 10);
      if (Number.isNaN(courseId)) {
        return res.status(400).json({ success: false, message: 'Invalid course id' });
      }
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No video file uploaded' });
      }
      const title = (req.body.title || 'Lesson').toString().slice(0, 255);
      const sort_order = parseInt(req.body.sort_order, 10) || 0;
      const video_url = publicFileUrl(req.file.filename);
      const lesson = await CourseLesson.create({
        course_id: courseId,
        title,
        video_url,
        sort_order,
      });
      res.status(201).json({ success: true, data: lesson });
    } catch (error) {
      console.error('Lesson upload error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// @route   DELETE /api/courses/:id/lessons/:lessonId
// @desc    Remove a lesson
// @access  Private/Admin
router.delete('/:id/lessons/:lessonId', [auth, isAdmin], async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId, 10);
    const deleted = await CourseLesson.delete(lessonId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }
    res.json({ success: true, message: 'Lesson removed' });
  } catch (error) {
    console.error('Lesson delete error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private/Admin
router.put('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const course = await Course.update(req.params.id, req.body);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private/Admin
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const result = await Course.delete(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.json({ success: true, message: 'Course removed' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
