import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController";

import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = Router();

/* ==========================================
   Brand Logo Upload Middleware
========================================== */

const brandDir = "uploads/brands";

if (!fs.existsSync(brandDir)) {
  fs.mkdirSync(brandDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, brandDir);
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

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
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
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Get all brands
router.get("/", getBrands);

// Get a single brand
router.get("/:id", getBrand);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

// Create a new brand
router.post(
  "/",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  upload.single("logo"),
  createBrand
);

// Update a brand
router.put(
  "/:id",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  upload.single("logo"),
  updateBrand
);

// Delete a brand
router.delete(
  "/:id",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  deleteBrand
);

export default router;
