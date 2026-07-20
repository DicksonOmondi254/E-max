"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const paymentController_1 = require("../controllers/paymentController");
const router = (0, express_1.Router)();
/* ==========================================
   STK PUSH
========================================== */
router.post("/stk-push", authMiddleware_1.protect, paymentController_1.stkPush);
/* ==========================================
   CALLBACK
========================================== */
router.post("/callback", paymentController_1.callback);
/* ==========================================
   PAYMENT STATUS
========================================== */
router.get("/status/:checkoutRequestId", authMiddleware_1.protect, paymentController_1.paymentStatus);
exports.default = router;
