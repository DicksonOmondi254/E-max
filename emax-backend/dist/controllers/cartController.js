"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeCartItem = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const prisma_1 = require("../config/prisma");
/**
 * Get logged-in user's cart
 */
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        let cart = await prisma_1.prisma.cart.findUnique({
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
            cart = await prisma_1.prisma.cart.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch cart.",
        });
    }
};
exports.getCart = getCart;
/**
 * Add product to cart
 */
const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity, } = req.body;
        let cart = await prisma_1.prisma.cart.findUnique({
            where: {
                userId,
            },
        });
        if (!cart) {
            cart = await prisma_1.prisma.cart.create({
                data: {
                    userId,
                },
            });
        }
        const existingItem = await prisma_1.prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId,
            },
        });
        if (existingItem) {
            const item = await prisma_1.prisma.cartItem.update({
                where: {
                    id: existingItem.id,
                },
                data: {
                    quantity: existingItem.quantity + quantity,
                },
            });
            return res.json({
                success: true,
                data: item,
            });
        }
        const item = await prisma_1.prisma.cartItem.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to add product.",
        });
    }
};
exports.addToCart = addToCart;
/**
 * Update quantity
 */
const updateCartItem = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { quantity, } = req.body;
        const item = await prisma_1.prisma.cartItem.update({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update cart.",
        });
    }
};
exports.updateCartItem = updateCartItem;
/**
 * Remove item
 */
const removeCartItem = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma_1.prisma.cartItem.delete({
            where: {
                id,
            },
        });
        res.json({
            success: true,
            message: "Item removed.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to remove item.",
        });
    }
};
exports.removeCartItem = removeCartItem;
/**
 * Clear cart
 */
const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await prisma_1.prisma.cart.findUnique({
            where: {
                userId,
            },
        });
        if (!cart) {
            return res.json({
                success: true,
            });
        }
        await prisma_1.prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id,
            },
        });
        res.json({
            success: true,
            message: "Cart cleared.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to clear cart.",
        });
    }
};
exports.clearCart = clearCart;
