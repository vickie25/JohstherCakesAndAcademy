const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDir = path.join(__dirname, '../uploads/courses');
fs.mkdirSync(uploadDir, { recursive: true });

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `thumb-${req.params.id}-${Date.now()}${ext}`);
  },
});

const videoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp4';
    const prefix = file.fieldname === 'promo' ? 'promo' : 'lesson';
    cb(null, `${prefix}-${req.params.id}-${Date.now()}${ext}`);
  },
});

const imageFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed for the thumbnail.'));
};

const videoFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith('video/')) cb(null, true);
  else cb(new Error('Only video files are allowed.'));
};

const uploadCourseThumbnail = multer({
  storage: imageStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: imageFilter,
});

const uploadCourseVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 512 * 1024 * 1024 },
  fileFilter: videoFilter,
});

module.exports = {
  uploadDir,
  uploadCourseThumbnail,
  uploadCourseVideo,
};
