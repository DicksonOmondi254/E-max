"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Admin/global dashboard stats (kept intact)
router.get("/", authMiddleware_1.protect, dashboardController_1.getDashboardStats);
exports.default = router;
