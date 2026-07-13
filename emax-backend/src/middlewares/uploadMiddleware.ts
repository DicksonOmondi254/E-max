import multer from "multer";
import path from "path";
import fs from "fs";

// Absolute path to uploads/products
export const uploadDir = path.join(
  process.cwd(),
  "uploads",
  "products"
);

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const timestamp = Date.now();

    const random = Math.round(
      Math.random() * 1e9
    );

    const extension = path.extname(
      file.originalname
    );

    cb(
      null,
      `${timestamp}-${random}${extension}`
    );
  },
});

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP and GIF images are allowed."
      )
    );
  }

  cb(null, true);
};

export const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5,                  // Future support for multiple images
  },
});