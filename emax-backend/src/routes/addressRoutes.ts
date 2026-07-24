import { Router } from "express";
import { addressController } from "../controllers/addressController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

// All address routes require authentication
router.get("/", protect, addressController.getAll);
router.get("/:id", protect, addressController.getById);
router.post("/", protect, addressController.create);
router.put("/:id", protect, addressController.update);
router.put("/:id/default", protect, addressController.setDefault);
router.delete("/:id", protect, addressController.delete);

export default router;

