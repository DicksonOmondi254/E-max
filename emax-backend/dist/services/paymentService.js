"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
const prisma_1 = require("../config/prisma");
exports.paymentService = {
    /* ==========================================
       STK PUSH
    ========================================== */
    async stkPush(data) {
        const order = await prisma_1.prisma.order.findUnique({
            where: {
                id: data.orderId,
            },
        });
        if (!order) {
            throw new Error("Order not found.");
        }
        // TODO:
        // Replace this mock response with an actual Daraja STK Push request.
        const checkoutRequestId = `CHK-${Date.now()}`;
        return {
            MerchantRequestID: `MR-${Date.now()}`,
            CheckoutRequestID: checkoutRequestId,
            ResponseCode: "0",
            ResponseDescription: "Success. Request accepted for processing.",
            CustomerMessage: "Success. Please complete payment on your phone.",
        };
    },
    /* ==========================================
       PROCESS CALLBACK
    ========================================== */
    async processCallback(callbackData) {
        const stkCallback = callbackData?.Body?.stkCallback;
        if (!stkCallback) {
            return;
        }
        const checkoutRequestId = stkCallback.CheckoutRequestID;
        const resultCode = stkCallback.ResultCode;
        // TODO:
        // When a Payment model is added, persist the callback here.
        if (resultCode === 0) {
            console.log(`Payment successful: ${checkoutRequestId}`);
        }
        else {
            console.log(`Payment failed: ${checkoutRequestId}`);
        }
        return true;
    },
    /* ==========================================
       PAYMENT STATUS
    ========================================== */
    async getPaymentStatus(checkoutRequestId) {
        // TODO:
        // Replace with database lookup after creating Payment model.
        return {
            checkoutRequestId,
            status: "PENDING",
        };
    },
};
