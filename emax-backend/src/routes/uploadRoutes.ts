import { Router } from "express";
import { upload } from "../middlewares/upload";
import { uploadImage, uploadSellerMedia } from "../controllers/uploadController";
import { upload as sellerUpload } from "../middlewares/uploadMiddleware";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = Router();

router.post(
  "/product",
  upload.single("image"),
  uploadImage
);

router.post(
  "/seller",
  protect,
  authorize("SELLER", "ADMIN", "SUPER_ADMIN"),
  sellerUpload.single("image"),
  uploadSellerMedia
);

export default router;
