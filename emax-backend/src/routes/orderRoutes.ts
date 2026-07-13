import { Router } from "express";

import {
  createOrder,
  getOrders,
  getOrder,
} from "../controllers/orderController";

import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", protect, createOrder);

router.get("/", protect, getOrders);

router.get("/:id", protect, getOrder);

export default router;