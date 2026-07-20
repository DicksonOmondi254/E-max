import { Request, Response } from "express";
import { paymentService } from "../services/paymentService";

/* =====================================================
   STK PUSH
===================================================== */

export const stkPush = async (
  req: Request,
  res: Response
) => {
  try {
    const { phone, amount, orderId } = req.body;

    if (!phone || !amount || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Phone, amount and orderId are required.",
      });
    }

    const response = await paymentService.stkPush({
      phone,
      amount: Number(amount),
      orderId: Number(orderId),
    });

    res.status(200).json({
      success: true,
      message: "STK Push initiated.",
      data: response,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to initiate payment.",
    });
  }
};

/* =====================================================
   CALLBACK
===================================================== */

export const callback = async (
  req: Request,
  res: Response
) => {
  try {
    await paymentService.processCallback(req.body);

    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  } catch (error) {
    console.error(error);

    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  }
};

/* =====================================================
   PAYMENT STATUS
===================================================== */

export const paymentStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const checkoutRequestId = req.query.checkoutRequestId;

if (
  typeof checkoutRequestId !== "string"
) {
  return res.status(400).json({
    success: false,
    message: "Invalid checkout request ID.",
  });
}

const status =
  await paymentService.getPaymentStatus(
    checkoutRequestId
  );
    res.json({
      success: true,
      data: paymentStatus,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch payment status.",
    });
  }
};