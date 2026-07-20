import { Request, Response } from "express";
import { wishlistService } from "../services/wishlistService";

/* =====================================================
   GET USER WISHLIST
===================================================== */

export const getWishlist = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const wishlist =
      await wishlistService.getWishlist(userId);

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch wishlist.",
    });
  }
};

/* =====================================================
   ADD ITEM TO WISHLIST
===================================================== */

export const addToWishlist = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const productId = Number(req.body.productId);

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const wishlist =
      await wishlistService.addItem(
        userId,
        productId
      );

    res.status(201).json({
      success: true,
      message: "Product added to wishlist.",
      data: wishlist,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to add product to wishlist.",
    });
  }
};

/* =====================================================
   REMOVE ITEM FROM WISHLIST
===================================================== */

export const removeFromWishlist = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const productId = Number(req.params.productId);

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    await wishlistService.removeItem(
      userId,
      productId
    );

    res.status(200).json({
      success: true,
      message:
        "Product removed from wishlist.",
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to remove product.",
    });
  }
};

/* =====================================================
   CLEAR WISHLIST
===================================================== */

export const clearWishlist = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    await wishlistService.clearWishlist(
      userId
    );

    res.status(200).json({
      success: true,
      message: "Wishlist cleared.",
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to clear wishlist.",
    });
  }
};