import { Router } from "express";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController";

import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", protect, getCart);

router.post("/add", protect, addToCart);

router.put("/update/:id", protect, updateCartItem);

router.delete("/remove/:id", protect, removeCartItem);

router.delete("/clear", protect, clearCart);

export default router;