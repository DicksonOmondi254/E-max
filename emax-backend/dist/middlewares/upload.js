"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/* ==========================================
   Ensure Upload Directories Exist
========================================== */
const productDir = "uploads/products";
if (!fs_1.default.existsSync(productDir)) {
    fs_1.default.mkdirSync(productDir, { recursive: true });
}
/* ==========================================
   Storage
========================================== */
const storage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        cb(null, productDir);
    },
    filename(req, file, cb) {
        const unique = Date.now() +
            "-" +
            Math.round(Math.random() * 1e9);
        cb(null, unique + path_1.default.extname(file.originalname));
    },
});
/* ==========================================
   File Filter
========================================== */
const fileFilter = (req, file, cb) => {
    const allowed = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
    ];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
    }
};
/* ==========================================
   Upload
========================================== */
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
