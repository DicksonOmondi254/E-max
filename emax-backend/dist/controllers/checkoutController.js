"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = void 0;
const checkoutService_1 = require("../services/checkoutService");
const checkout = async (req, res) => {
    try {
        const userId = req.user.id;
        const order = await (0, checkoutService_1.checkoutService)(userId);
        res.status(201).json({
            success: true,
            message: "Checkout completed successfully.",
            data: order,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.checkout = checkout;
