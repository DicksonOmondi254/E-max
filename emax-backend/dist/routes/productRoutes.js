"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const router = (0, express_1.Router)();
/* =====================================================
   PUBLIC ROUTES
===================================================== */
/**
 * GET /api/products
 * Get all products
 */
router.get("/", productController_1.getProducts);
/**
 * GET /api/products/slug/:slug
 * Get a product by slug
 * (Must come before "/:id")
 */
router.get("/slug/:slug", productController_1.getProductBySlug);
/**
 * GET /api/products/:id
 * Get product by ID
 */
router.get("/:id", productController_1.getProduct);
/* =====================================================
   ADMIN ROUTES
===================================================== */
/**
 * POST /api/products
 * Create product
 */
router.post("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), uploadMiddleware_1.upload.single("image"), productController_1.createProduct);
/**
 * PUT /api/products/:id
 * Update product
 */
router.put("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), uploadMiddleware_1.upload.single("image"), productController_1.updateProduct);
/**
 * PATCH /api/products/:id/featured
 * Toggle featured status
 */
router.patch("/:id/featured", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), productController_1.toggleFeatured);
/**
 * PATCH /api/products/:id/status
 * Toggle active/inactive status
 */
router.patch("/:id/status", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), productController_1.toggleProductStatus);
/**
 * DELETE /api/products/:id
 * Delete product
 */
router.delete("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN", "SUPER_ADMIN"), productController_1.deleteProduct);
exports.default = router;
