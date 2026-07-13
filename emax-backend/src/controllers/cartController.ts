import { Request, Response } from "express";
import { prisma } from "../config/prisma";

/**
 * Get logged-in user's cart
 */
export const getCart = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    let cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cart.",
    });
  }
};

/**
 * Add product to cart
 */
export const addToCart = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const {
      productId,
      quantity,
    } = req.body;

    let cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
      });
    }

    const existingItem =
      await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
        },
      });

    if (existingItem) {
      const item =
        await prisma.cartItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            quantity:
              existingItem.quantity + quantity,
          },
        });

      return res.json({
        success: true,
        data: item,
      });
    }

    const item = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add product.",
    });
  }
};

/**
 * Update quantity
 */
export const updateCartItem = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const {
      quantity,
    } = req.body;

    const item =
      await prisma.cartItem.update({
        where: {
          id,
        },
        data: {
          quantity,
        },
      });

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update cart.",
    });
  }
};

/**
 * Remove item
 */
export const removeCartItem = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await prisma.cartItem.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
      message: "Item removed.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to remove item.",
    });
  }
};

/**
 * Clear cart
 */
export const clearCart = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const cart =
      await prisma.cart.findUnique({
        where: {
          userId,
        },
      });

    if (!cart) {
      return res.json({
        success: true,
      });
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    res.json({
      success: true,
      message: "Cart cleared.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to clear cart.",
    });
  }
};