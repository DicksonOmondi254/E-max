import { Router } from "express";
import { Role } from "@prisma/client";
import {
  getSalesReport,
  getFinanceReport,
  getInventoryReport,
  getCustomerReport,
  getPerformanceReport,
} from "../controllers/reportController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = Router();

// All report routes require ADMIN or SUPER_ADMIN role
router.use(protect);
router.use(authorize(Role.ADMIN, Role.SUPER_ADMIN));

router.get("/sales", getSalesReport);
router.get("/finance", getFinanceReport);
router.get("/inventory", getInventoryReport);
router.get("/customers", getCustomerReport);
router.get("/performance", getPerformanceReport);

export default router;

