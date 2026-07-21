"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storeSettingsController_1 = require("../controllers/storeSettingsController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
// Public route (anyone can read settings like store name, contact info)
router.get("/", storeSettingsController_1.storeSettingsController.getSettings);
// Protected admin routes
router.put("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), storeSettingsController_1.storeSettingsController.updateSettings);
exports.default = router;
