"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addressController_1 = require("../controllers/addressController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// All address routes require authentication
router.get("/", authMiddleware_1.protect, addressController_1.addressController.getAll);
router.get("/:id", authMiddleware_1.protect, addressController_1.addressController.getById);
router.post("/", authMiddleware_1.protect, addressController_1.addressController.create);
router.put("/:id", authMiddleware_1.protect, addressController_1.addressController.update);
router.put("/:id/default", authMiddleware_1.protect, addressController_1.addressController.setDefault);
router.delete("/:id", authMiddleware_1.protect, addressController_1.addressController.delete);
exports.default = router;
