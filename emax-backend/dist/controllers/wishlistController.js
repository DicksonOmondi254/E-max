"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearWishlist = exports.removeFromWishlist = exports.addToWishlist = exports.getWishlist = void 0;
const wishlistService_1 = require("../services/wishlistService");
/* =====================================================
   GET USER WISHLIST
===================================================== */
const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const wishlist = await wishlistService_1.wishlistService.getWishlist(userId);
        res.status(200).json({
            success: true,
            data: wishlist,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to fetch wishlist.",
        });
    }
};
exports.getWishlist = getWishlist;
/* =====================================================
   ADD ITEM TO WISHLIST
===================================================== */
const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = Number(req.body.productId);
        if (isNaN(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID.",
            });
        }
        const wishlist = await wishlistService_1.wishlistService.addItem(userId, productId);
        res.status(201).json({
            success: true,
            message: "Product added to wishlist.",
            data: wishlist,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to add product to wishlist.",
        });
    }
};
exports.addToWishlist = addToWishlist;
/* =====================================================
   REMOVE ITEM FROM WISHLIST
===================================================== */
const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = Number(req.params.productId);
        if (isNaN(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID.",
            });
        }
        await wishlistService_1.wishlistService.removeItem(userId, productId);
        res.status(200).json({
            success: true,
            message: "Product removed from wishlist.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to remove product.",
        });
    }
};
exports.removeFromWishlist = removeFromWishlist;
/* =====================================================
   CLEAR WISHLIST
===================================================== */
const clearWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        await wishlistService_1.wishlistService.clearWishlist(userId);
        res.status(200).json({
            success: true,
            message: "Wishlist cleared.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to clear wishlist.",
        });
    }
};
exports.clearWishlist = clearWishlist;
