import multer from "multer";
import path from "path";
import fs from "fs";

/* ==========================================
   Ensure Upload Directories Exist
========================================== */

const productDir = "uploads/products";

if (!fs.existsSync(productDir)) {
  fs.mkdirSync(productDir, { recursive: true });
}

/* ==========================================
   Storage
========================================== */

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, productDir);
  },

  filename(req, file, cb) {
    const unique =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    cb(
      null,
      unique + path.extname(file.originalname)
    );
  },
});

/* ==========================================
   File Filter
========================================== */

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      )
    );
  }
};

/* ==========================================
   Upload
========================================== */

export const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});