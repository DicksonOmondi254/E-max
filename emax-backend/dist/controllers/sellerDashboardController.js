"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSellerDeactivationController = exports.updateSellerLocationController = exports.getSellerLocationController = exports.updateSellerProfileData = exports.deleteBulkDiscountController = exports.getBulkDiscountByIdController = exports.getSellerBulkDiscountsController = exports.createBulkDiscountController = exports.deleteFlashSaleController = exports.getFlashSaleByIdController = exports.getSellerFlashSalesController = exports.createFlashSaleController = exports.getSellerProfileData = exports.getSellerPerformanceData = exports.getSellerReviewsList = exports.getSellerReturnsList = exports.getSellerEarningsList = exports.updateOrderStatus = exports.getSellerOrdersList = exports.getSellerProductsList = exports.getSellerStats = void 0;
const sellerDashboardService_1 = require("../services/sellerDashboardService");
const getUserId = (req) => req.user?.id ?? null;
const handleRequest = async (req, res, handler) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }
        const data = await handler(userId);
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        console.error("Seller Controller Error:", error);
        res.status(500).json({ success: false, message: error.message || "Internal server error." });
    }
};
// Dashboard
const getSellerStats = async (req, res) => {
    await handleRequest(req, res, (userId) => (0, sellerDashboardService_1.getSellerDashboardStats)(userId));
};
exports.getSellerStats = getSellerStats;
// Products
const getSellerProductsList = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }
        const q = req.query;
        const result = await (0, sellerDashboardService_1.getSellerProducts)(userId, {
            search: q.search,
            active: q.active,
            featured: q.featured,
            page: q.page ? parseInt(q.page, 10) : undefined,
            limit: q.limit ? parseInt(q.limit, 10) : undefined,
        });
        res.status(200).json({ success: true, data: result.data, pagination: { page: result.page, limit: result.limit, total: result.total, pages: result.pages } });
    }
    catch (error) {
        console.error("Seller Products Error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to load products." });
    }
};
exports.getSellerProductsList = getSellerProductsList;
// Orders
const getSellerOrdersList = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }
        const q = req.query;
        const result = await (0, sellerDashboardService_1.getSellerOrders)(userId, {
            status: q.status,
            search: q.search,
            page: q.page ? parseInt(q.page, 10) : undefined,
            limit: q.limit ? parseInt(q.limit, 10) : undefined,
        });
        res.status(200).json({ success: true, data: result.data, pagination: { page: result.page, limit: result.limit, total: result.total, pages: result.pages } });
    }
    catch (error) {
        console.error("Seller Orders Error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to load orders." });
    }
};
exports.getSellerOrdersList = getSellerOrdersList;
// Update Order Status
const updateOrderStatus = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }
        const id = parseInt(String(req.params.id), 10);
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ success: false, message: "Status is required." });
        }
        const order = await (0, sellerDashboardService_1.updateSellerOrderStatus)(userId, id, status);
        res.status(200).json({ success: true, data: order });
    }
    catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to update order status." });
    }
};
exports.updateOrderStatus = updateOrderStatus;
// Earnings
const getSellerEarningsList = async (req, res) => {
    await handleRequest(req, res, (userId) => (0, sellerDashboardService_1.getSellerEarnings)(userId));
};
exports.getSellerEarningsList = getSellerEarningsList;
// Returns
const getSellerReturnsList = async (req, res) => {
    await handleRequest(req, res, (userId) => (0, sellerDashboardService_1.getSellerReturns)(userId));
};
exports.getSellerReturnsList = getSellerReturnsList;
// Reviews
const getSellerReviewsList = async (req, res) => {
    await handleRequest(req, res, (userId) => (0, sellerDashboardService_1.getSellerReviews)(userId));
};
exports.getSellerReviewsList = getSellerReviewsList;
// Performance
const getSellerPerformanceData = async (req, res) => {
    await handleRequest(req, res, (userId) => (0, sellerDashboardService_1.getSellerPerformance)(userId));
};
exports.getSellerPerformanceData = getSellerPerformanceData;
// Profile
const getSellerProfileData = async (req, res) => {
    await handleRequest(req, res, (userId) => (0, sellerDashboardService_1.getSellerProfile)(userId));
};
exports.getSellerProfileData = getSellerProfileData;
/* ── Flash Sales ── */
const createFlashSaleController = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }
        const { title, description, discountPercentage, startDate, endDate, productIds } = req.body;
        if (!title || !discountPercentage || !startDate || !endDate || !productIds?.length) {
            return res.status(400).json({ success: false, message: "Missing required fields: title, discountPercentage, startDate, endDate, productIds." });
        }
        const flashSale = await (0, sellerDashboardService_1.createFlashSale)(userId, {
            title,
            description,
            discountPercentage,
            startDate,
            endDate,
            productIds,
        });
        res.status(201).json({ success: true, data: flashSale });
    }
    catch (error) {
        console.error("Create Flash Sale Error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to create flash sale." });
    }
};
exports.createFlashSaleController = createFlashSaleController;
const getSellerFlashSalesController = async (req, res) => {
    await handleRequest(req, res, (userId) => (0, sellerDashboardService_1.getSellerFlashSales)(userId));
};
exports.getSellerFlashSalesController = getSellerFlashSalesController;
const getFlashSaleByIdController = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }
        const flashSaleId = parseInt(String(req.params.id), 10);
        const flashSale = await (0, sellerDashboardService_1.getFlashSaleById)(userId, flashSaleId);
        if (!flashSale) {
            return res.status(404).json({ success: false, message: "Flash sale not found." });
        }
        res.status(200).json({ success: true, data: flashSale });
    }
    catch (error) {
        console.error("Get Flash Sale Error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to get flash sale." });
    }
};
exports.getFlashSaleByIdController = getFlashSaleByIdController;
const deleteFlashSaleController = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }
        const flashSaleId = parseInt(String(req.params.id), 10);
        await (0, sellerDashboardService_1.deleteFlashSale)(userId, flashSaleId);
        res.status(200).json({ success: true, message: "Flash sale deleted successfully." });
    }
    catch (error) {
        console.error("Delete Flash Sale Error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to delete flash sale." });
    }
};
exports.deleteFlashSaleController = deleteFlashSaleController;
/* ── Bulk Discounts ── */
const createBulkDiscountController = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }
        const { name, description, startDate, endDate, productIds, tiers } = req.body;
        if (!name || !startDate || !endDate || !productIds?.length || !tiers?.length) {
            return res.status(400).json({ success: false, message: "Missing required fields: name, startDate, endDate, productIds, tiers." });
        }
        const bulkDiscount = await (0, sellerDashboardService_1.createBulkDiscountService)(userId, {
            name,
            description,
            startDate,
            endDate,
            productIds,
            tiers,
        });
        res.status(201).json({ success: true, data: bulkDiscount });
    }
    catch (error) {
        console.error("Create Bulk Discount Error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to create bulk discount." });
    }
};
exports.createBulkDiscountController = createBulkDiscountController;
const getSellerBulkDiscountsController = async (req, res) => {
    await handleRequest(req, res, (userId) => (0, sellerDashboardService_1.getSellerBulkDiscounts)(userId));
};
exports.getSellerBulkDiscountsController = getSellerBulkDiscountsController;
const getBulkDiscountByIdController = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }
        const bulkDiscountId = parseInt(String(req.params.id), 10);
        const bulkDiscount = await (0, sellerDashboardService_1.getBulkDiscountById)(userId, bulkDiscountId);
        if (!bulkDiscount) {
            return res.status(404).json({ success: false, message: "Bulk discount not found." });
        }
        res.status(200).json({ success: true, data: bulkDiscount });
    }
    catch (error) {
        console.error("Get Bulk Discount Error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to get bulk discount." });
    }
};
exports.getBulkDiscountByIdController = getBulkDiscountByIdController;
const deleteBulkDiscountController = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }
        const bulkDiscountId = parseInt(String(req.params.id), 10);
        await (0, sellerDashboardService_1.deleteBulkDiscount)(userId, bulkDiscountId);
        res.status(200).json({ success: true, message: "Bulk discount deleted successfully." });
    }
    catch (error) {
        console.error("Delete Bulk Discount Error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to delete bulk discount." });
    }
};
exports.deleteBulkDiscountController = deleteBulkDiscountController;
const updateSellerProfileData = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }
        const { shopName, shopDescription, phone, shopLogo, shopBanner, trustBadges } = req.body;
        const updatedProfile = await (0, sellerDashboardService_1.updateSellerProfile)(userId, {
            shopName,
            shopDescription,
            phone,
            shopLogo,
            shopBanner,
            trustBadges,
        });
        res.status(200).json({ success: true, data: updatedProfile, message: "Profile updated successfully." });
    }
    catch (error) {
        console.error("Update Seller Profile Error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to update profile." });
    }
};
exports.updateSellerProfileData = updateSellerProfileData;
/* ── Seller Location ── */
const getSellerLocationController = async (req, res) => {
    await handleRequest(req, res, (userId) => (0, sellerDashboardService_1.getSellerLocation)(userId));
};
exports.getSellerLocationController = getSellerLocationController;
const updateSellerLocationController = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }
        const { addressLine1, addressLine2, city, state, country, postalCode } = req.body;
        const location = await (0, sellerDashboardService_1.updateSellerLocation)(userId, { addressLine1, addressLine2, city, state, country, postalCode });
        res.status(200).json({ success: true, data: location, message: "Location updated successfully." });
    }
    catch (error) {
        console.error("Update Seller Location Error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to update location." });
    }
};
exports.updateSellerLocationController = updateSellerLocationController;
/* ── Deactivation Check ── */
const checkSellerDeactivationController = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }
        const result = await (0, sellerDashboardService_1.checkSellerDeactivationStatus)(userId);
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        console.error("Deactivation Check Error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to check deactivation status." });
    }
};
exports.checkSellerDeactivationController = checkSellerDeactivationController;
