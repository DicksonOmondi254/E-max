"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.cancelOrder = exports.updateOrderStatus = exports.getOrder = exports.getOrders = exports.getMyOrders = exports.createOrder = void 0;
const orderService_1 = require("../services/orderService");
/* =====================================================
   CREATE ORDER
===================================================== */
const createOrder = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { items } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
        }
        if (!items ||
            !Array.isArray(items) ||
            items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order items are required.",
            });
        }
        const order = await orderService_1.orderService.createOrder(userId, items);
        return res.status(201).json({
            success: true,
            message: "Order created successfully.",
            data: order,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to create order.",
        });
    }
};
exports.createOrder = createOrder;
/* =====================================================
   GET MY ORDERS
===================================================== */
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
        }
        const orders = await orderService_1.orderService.getUserOrders(userId);
        return res.json({
            success: true,
            count: orders.length,
            data: orders,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to fetch orders.",
        });
    }
};
exports.getMyOrders = getMyOrders;
/* =====================================================
   GET ALL ORDERS
===================================================== */
const getOrders = async (req, res) => {
    try {
        const orders = await orderService_1.orderService.getOrders();
        return res.json({
            success: true,
            count: orders.length,
            data: orders,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to fetch orders.",
        });
    }
};
exports.getOrders = getOrders;
/* =====================================================
   GET SINGLE ORDER
===================================================== */
const getOrder = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID.",
            });
        }
        const order = await orderService_1.orderService.getOrder(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }
        return res.json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to fetch order.",
        });
    }
};
exports.getOrder = getOrder;
/* =====================================================
   UPDATE ORDER STATUS
===================================================== */
const updateOrderStatus = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;
        const order = await orderService_1.orderService.updateStatus(id, status);
        return res.json({
            success: true,
            message: "Order status updated.",
            data: order,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to update status.",
        });
    }
};
exports.updateOrderStatus = updateOrderStatus;
/* =====================================================
   CANCEL ORDER
===================================================== */
const cancelOrder = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await orderService_1.orderService.cancelOrder(id);
        return res.json({
            success: true,
            message: "Order cancelled successfully.",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to cancel order.",
        });
    }
};
exports.cancelOrder = cancelOrder;
/* =====================================================
   DELETE ORDER
===================================================== */
const deleteOrder = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await orderService_1.orderService.deleteOrder(id);
        return res.json({
            success: true,
            message: "Order deleted successfully.",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to delete order.",
        });
    }
};
exports.deleteOrder = deleteOrder;
