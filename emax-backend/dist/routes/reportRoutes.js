"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const reportController_1 = require("../controllers/reportController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
// All report routes require ADMIN or SUPER_ADMIN role
router.use(authMiddleware_1.protect);
router.use((0, roleMiddleware_1.authorize)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN));
router.get("/sales", reportController_1.getSalesReport);
router.get("/finance", reportController_1.getFinanceReport);
router.get("/inventory", reportController_1.getInventoryReport);
router.get("/customers", reportController_1.getCustomerReport);
router.get("/performance", reportController_1.getPerformanceReport);
exports.default = router;
