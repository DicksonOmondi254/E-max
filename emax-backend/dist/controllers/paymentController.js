"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentStatus = exports.callback = exports.stkPush = void 0;
const paymentService_1 = require("../services/paymentService");
/* =====================================================
   STK PUSH
===================================================== */
const stkPush = async (req, res) => {
    try {
        const { phone, amount, orderId } = req.body;
        if (!phone || !amount || !orderId) {
            return res.status(400).json({
                success: false,
                message: "Phone, amount and orderId are required.",
            });
        }
        const response = await paymentService_1.paymentService.stkPush({
            phone,
            amount: Number(amount),
            orderId: Number(orderId),
        });
        res.status(200).json({
            success: true,
            message: "STK Push initiated.",
            data: response,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to initiate payment.",
        });
    }
};
exports.stkPush = stkPush;
/* =====================================================
   CALLBACK
===================================================== */
const callback = async (req, res) => {
    try {
        await paymentService_1.paymentService.processCallback(req.body);
        return res.status(200).json({
            ResultCode: 0,
            ResultDesc: "Accepted",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(200).json({
            ResultCode: 0,
            ResultDesc: "Accepted",
        });
    }
};
exports.callback = callback;
/* =====================================================
   PAYMENT STATUS
===================================================== */
const paymentStatus = async (req, res) => {
    try {
        const checkoutRequestId = req.query.checkoutRequestId;
        if (typeof checkoutRequestId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid checkout request ID.",
            });
        }
        const status = await paymentService_1.paymentService.getPaymentStatus(checkoutRequestId);
        res.json({
            success: true,
            data: exports.paymentStatus,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to fetch payment status.",
        });
    }
};
exports.paymentStatus = paymentStatus;
