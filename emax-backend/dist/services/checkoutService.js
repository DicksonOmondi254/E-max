"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutService = void 0;
const prisma_1 = require("../config/prisma");
const checkoutService = async (userId) => {
    const cart = await prisma_1.prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
    if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty.");
    }
    let total = 0;
    for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
            throw new Error(`${item.product.name} has insufficient stock.`);
        }
        total += item.product.price * item.quantity;
    }
    const order = await prisma_1.prisma.order.create({
        data: {
            orderNumber: `EMX-${Date.now()}`,
            totalAmount: total,
            userId,
        },
    });
    for (const item of cart.items) {
        await prisma_1.prisma.orderItem.create({
            data: {
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
            },
        });
        await prisma_1.prisma.product.update({
            where: {
                id: item.productId,
            },
            data: {
                stock: {
                    decrement: item.quantity,
                },
            },
        });
    }
    await prisma_1.prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id,
        },
    });
    return order;
};
exports.checkoutService = checkoutService;
