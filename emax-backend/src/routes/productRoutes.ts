import { Router } from "express";

import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

router.get("/", getProducts);

router.get("/:id", getProduct);

router.post(
  "/",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  upload.single("image"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  deleteProduct
);

export default router;