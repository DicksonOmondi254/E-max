import { Router } from "express";

import {
  getProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  toggleProductStatus,
} from "../controllers/productController";

import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

/* =====================================================
   PUBLIC ROUTES
===================================================== */

/**
 * GET /api/products
 * Get all products
 */
router.get("/", getProducts);

/**
 * GET /api/products/slug/:slug
 * Get a product by slug
 * (Must come before "/:id")
 */
router.get("/slug/:slug", getProductBySlug);

/**
 * GET /api/products/:id
 * Get product by ID
 */
router.get("/:id", getProduct);

/* =====================================================
   ADMIN ROUTES
===================================================== */

/**
 * POST /api/products
 * Create product
 */
router.post(
  "/",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  upload.single("image"),
  createProduct
);

/**
 * PUT /api/products/:id
 * Update product
 */
router.put(
  "/:id",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  upload.single("image"),
  updateProduct
);

/**
 * PATCH /api/products/:id/featured
 * Toggle featured status
 */
router.patch(
  "/:id/featured",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  toggleFeatured
);

/**
 * PATCH /api/products/:id/status
 * Toggle active/inactive status
 */
router.patch(
  "/:id/status",
  protect,
 authorize("ADMIN", "SUPER_ADMIN"),
  toggleProductStatus
);

/**
 * DELETE /api/products/:id
 * Delete product
 */
router.delete(
  "/:id",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  deleteProduct
);

export default router;