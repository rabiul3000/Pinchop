import multer from "multer";

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    // Maximum file size: 5 MB
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new multer.MulterError(
          "LIMIT_UNEXPECTED_FILE",
          "Only JPEG, PNG, WebP, and PDF files are allowed."
        )
      );
    }
  },
});

const multerMiddle = (fieldName) => {
  return upload.single(fieldName);
};

export default multerMiddle;