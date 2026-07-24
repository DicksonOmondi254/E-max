"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profileController_1 = require("../controllers/profileController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// All profile routes require authentication
router.get("/", authMiddleware_1.protect, profileController_1.profileController.getProfile);
router.put("/", authMiddleware_1.protect, profileController_1.profileController.updateProfile);
router.put("/change-password", authMiddleware_1.protect, profileController_1.profileController.changePassword);
exports.default = router;
