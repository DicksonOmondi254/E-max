import { Request, Response } from "express";
import { orderService } from "../services/orderService";

/* =====================================================
   CREATE ORDER
===================================================== */

export const createOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { items } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Order items are required.",
      });
    }

    const order = await orderService.createOrder(
      userId,
      items
    );

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: order,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create order.",
    });
  }
};

/* =====================================================
   GET MY ORDERS
===================================================== */

export const getMyOrders = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const orders =
      await orderService.getUserOrders(userId);

    return res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch orders.",
    });
  }
};

/* =====================================================
   GET ALL ORDERS
===================================================== */

export const getOrders = async (
  req: Request,
  res: Response
) => {
  try {
    const orders =
      await orderService.getOrders();

    return res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch orders.",
    });
  }
};

/* =====================================================
   GET SINGLE ORDER
===================================================== */

export const getOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order =
      await orderService.getOrder(id);

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
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch order.",
    });
  }
};

/* =====================================================
   UPDATE ORDER STATUS
===================================================== */

export const updateOrderStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const order =
      await orderService.updateStatus(
        id,
        status
      );

    return res.json({
      success: true,
      message: "Order status updated.",
      data: order,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update status.",
    });
  }
};

/* =====================================================
   CANCEL ORDER
===================================================== */

export const cancelOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await orderService.cancelOrder(id);

    return res.json({
      success: true,
      message: "Order cancelled successfully.",
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to cancel order.",
    });
  }
};

/* =====================================================
   DELETE ORDER
===================================================== */

export const deleteOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await orderService.deleteOrder(id);

    return res.json({
      success: true,
      message: "Order deleted successfully.",
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete order.",
    });
  }
};