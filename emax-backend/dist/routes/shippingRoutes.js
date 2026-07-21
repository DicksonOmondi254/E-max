"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shippingController_1 = require("../controllers/shippingController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.get("/zones", shippingController_1.shippingController.getAllZones);
router.get("/zones/:id", shippingController_1.shippingController.getZoneById);
router.get("/settings", shippingController_1.shippingController.getSettings);
// Protected admin routes
router.post("/zones", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), shippingController_1.shippingController.createZone);
router.put("/zones/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), shippingController_1.shippingController.updateZone);
router.delete("/zones/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), shippingController_1.shippingController.deleteZone);
router.put("/settings", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), shippingController_1.shippingController.updateSettings);
exports.default = router;
