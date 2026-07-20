"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = require("../middlewares/upload");
const uploadController_1 = require("../controllers/uploadController");
const router = (0, express_1.Router)();
router.post("/product", upload_1.upload.single("image"), uploadController_1.uploadImage);
exports.default = router;
