import { Router } from "express";
import { upload } from "../middleware/upload";
import { uploadImage } from "../controllers/uploadController";

const router = Router();

router.post(
  "/product",
  upload.single("image"),
  uploadImage
);

export default router;