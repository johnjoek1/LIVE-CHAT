//uploadMiddleware

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage configuration for local file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedOriginalName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${uniqueSuffix}-${sanitizedOriginalName}`);
  },
});

// Define file filter to allow specific file types
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif|mp4|mov|pdf|docx/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed types: JPEG, JPG, PNG, GIF, MP4, MOV, PDF, DOCX'));
  }
};

// Configure multer upload settings
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit files to 10MB
  fileFilter,
});

module.exports = upload;


