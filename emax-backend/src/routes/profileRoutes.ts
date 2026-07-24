import { Router } from "express";
import { profileController } from "../controllers/profileController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

// All profile routes require authentication
router.get("/", protect, profileController.getProfile);
router.put("/", protect, profileController.updateProfile);
router.put("/change-password", protect, profileController.changePassword);

export default router;

