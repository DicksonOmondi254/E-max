import { Router } from "express";

import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

router.get("/", getProducts);

router.get("/:id", getProduct);

router.post(
  "/",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  createProduct
);

router.put(
  "/:id",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  deleteProduct
);

export default router;