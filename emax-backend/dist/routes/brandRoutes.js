"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const brandController_1 = require("../controllers/brandController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
/* ==========================================
   Brand Logo Upload Middleware
========================================== */
const brandDir = "uploads/brands";
if (!fs_1.default.existsSync(brandDir)) {
    fs_1.default.mkdirSync(brandDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        cb(null, brandDir);
    },
    filename(req, file, cb) {
        const unique = Date.now() +
            "-" +
            Math.round(Math.random() * 1e9);
        cb(null, unique + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({
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
        }
        else {
            cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
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
router.get("/", brandController_1.getBrands);
// Get a single brand
router.get("/:id", brandController_1.getBrand);
/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
// Create a new brand
router.post("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), upload.single("logo"), brandController_1.createBrand);
// Update a brand
router.put("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), upload.single("logo"), brandController_1.updateBrand);
// Delete a brand
router.delete("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), brandController_1.deleteBrand);
exports.default = router;
