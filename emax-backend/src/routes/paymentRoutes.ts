import { Router } from "express";

import { protect } from "../middlewares/authMiddleware";

import {
  stkPush,
  callback,
  paymentStatus,
} from "../controllers/paymentController";

const router = Router();

/* ==========================================
   STK PUSH
========================================== */

router.post(
  "/stk-push",
  protect,
  stkPush
);

/* ==========================================
   CALLBACK
========================================== */

router.post(
  "/callback",
  callback
);

/* ==========================================
   PAYMENT STATUS
========================================== */

router.get(
  "/status/:checkoutRequestId",
  protect,
  paymentStatus
);

export default router;