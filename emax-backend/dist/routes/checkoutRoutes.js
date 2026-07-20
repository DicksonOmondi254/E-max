"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkoutController_1 = require("../controllers/checkoutController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.protect, checkoutController_1.checkout);
router.get("/", authMiddleware_1.protect, checkoutController_1.checkout);
exports.default = router;
