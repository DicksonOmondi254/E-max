import { Router } from "express";

import {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController";

import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Get all brands
router.get("/", getBrands);

// Get a single brand
router.get("/:id", getBrand);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

// Create a new brand
router.post(
  "/",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  createBrand
);

// Update a brand
router.put(
  "/:id",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  updateBrand
);

// Delete a brand
router.delete(
  "/:id",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  deleteBrand
);

export default router;