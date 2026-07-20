import { Router } from "express";

import {
  getAllCustomers,
  getCustomerDetail,
} from "../controllers/customerManagementController";

import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = Router();

/*
|--------------------------------------------------------------------------
| Admin Customer Management Routes
|--------------------------------------------------------------------------
*/

// Get all customers (paginated, searchable)
router.get(
  "/",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  getAllCustomers
);

// Get a single customer with order history
router.get(
  "/:id",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  getCustomerDetail
);

export default router;

