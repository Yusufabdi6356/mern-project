import multer from 'multer';

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Only .jpg, .jpeg and .png files are allowed');
      error.statusCode = 400;
      return cb(error);
    }
    cb(null, true);
  }
});
