import { Router } from "express";
import { storeSettingsController } from "../controllers/storeSettingsController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = Router();

// Public route (anyone can read settings like store name, contact info)
router.get("/", storeSettingsController.getSettings);

// Protected admin routes
router.put("/", protect, authorize("ADMIN", "SUPER_ADMIN"), storeSettingsController.updateSettings);

export default router;

