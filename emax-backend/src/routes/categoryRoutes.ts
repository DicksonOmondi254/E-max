import { Router } from "express";

import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

router.get("/", getCategories);

router.get("/:id", getCategory);

router.post(
  "/",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  createCategory
);

router.put(
  "/:id",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  updateCategory
);

router.delete(
  "/:id",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  deleteCategory
);

export default router;