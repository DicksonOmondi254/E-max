import { Router } from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", protect, getWishlist);
router.post("/", protect, addToWishlist,);
router.delete("/:productId", protect, removeFromWishlist,);
router.delete("/", protect, clearWishlist);

export default router;