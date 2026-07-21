import { Router } from "express";
import { shippingController } from "../controllers/shippingController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = Router();

// Public routes
router.get("/zones", shippingController.getAllZones);
router.get("/zones/:id", shippingController.getZoneById);
router.get("/settings", shippingController.getSettings);

// Protected admin routes
router.post("/zones", protect, authorize("ADMIN", "SUPER_ADMIN"), shippingController.createZone);
router.put("/zones/:id", protect, authorize("ADMIN", "SUPER_ADMIN"), shippingController.updateZone);
router.delete("/zones/:id", protect, authorize("ADMIN", "SUPER_ADMIN"), shippingController.deleteZone);
router.put("/settings", protect, authorize("ADMIN", "SUPER_ADMIN"), shippingController.updateSettings);

export default router;

