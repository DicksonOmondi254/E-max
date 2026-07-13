import { Request, Response } from "express";
import { checkoutService } from "../services/checkoutService";

export const checkout = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const order = await checkoutService(userId);

    res.status(201).json({
      success: true,
      message: "Checkout completed successfully.",
      data: order,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};