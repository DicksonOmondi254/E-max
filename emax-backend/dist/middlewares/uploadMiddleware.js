"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.uploadDir = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Absolute path to uploads/products
exports.uploadDir = path_1.default.join(process.cwd(), "uploads", "products");
// Create directory if it doesn't exist
if (!fs_1.default.existsSync(exports.uploadDir)) {
    fs_1.default.mkdirSync(exports.uploadDir, {
        recursive: true,
    });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, exports.uploadDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const random = Math.round(Math.random() * 1e9);
        const extension = path_1.default.extname(file.originalname);
        cb(null, `${timestamp}-${random}${extension}`);
    },
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Only JPG, JPEG, PNG, WEBP and GIF images are allowed."));
    }
    cb(null, true);
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 5, // Future support for multiple images
    },
});
