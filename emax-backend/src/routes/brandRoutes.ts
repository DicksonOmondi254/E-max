import { Router } from "express";

import {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

router.get("/", getBrands);

router.get("/:id", getBrand);

router.post(
  "/",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  createBrand
);

router.put(
  "/:id",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  updateBrand
);

router.delete(
  "/:id",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  deleteBrand
);

export default router;