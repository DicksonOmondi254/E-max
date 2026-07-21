"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerManagementController_1 = require("../controllers/customerManagementController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
/*
|--------------------------------------------------------------------------
| Admin Customer Management Routes
|--------------------------------------------------------------------------
*/
// Get all customers (paginated, searchable)
router.get("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), customerManagementController_1.getAllCustomers);
// Get a single customer with order history
router.get("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), customerManagementController_1.getCustomerDetail);
exports.default = router;
