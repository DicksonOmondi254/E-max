import { Router } from "express";
import { checkout } from "../controllers/checkoutController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", protect, checkout);
router.get("/", protect, checkout);

export default router;