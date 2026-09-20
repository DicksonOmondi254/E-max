"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateSellerAccountController = exports.updateSellerTrustBadgesController = exports.getLocationsController = exports.updateSellerStatusController = exports.getSellerDetailController = exports.getAllSellersController = exports.getSellerStatsController = void 0;
const sellerManagementService_1 = require("../services/sellerManagementService");
const getSellerStatsController = async (req, res) => {
    try {
        const stats = await sellerManagementService_1.sellerManagementService.getSellerStats();
        res.status(200).json({ success: true, data: stats });
    }
    catch (error) {
        console.error("Error fetching seller stats:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch seller stats.",
        });
    }
};
exports.getSellerStatsController = getSellerStatsController;
const getAllSellersController = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const search = req.query.search || undefined;
        const status = req.query.status || undefined;
        const location = req.query.location || undefined;
        const dateFrom = req.query.dateFrom || undefined;
        const dateTo = req.query.dateTo || undefined;
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder || "desc";
        const result = await sellerManagementService_1.sellerManagementService.getAllSellers(page, limit, search, status, location, dateFrom, dateTo, sortBy, sortOrder);
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        console.error("Error fetching sellers:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch sellers.",
        });
    }
};
exports.getAllSellersController = getAllSellersController;
const getSellerDetailController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid seller ID.",
            });
            return;
        }
        const seller = await sellerManagementService_1.sellerManagementService.getSellerById(id);
        if (!seller) {
            res.status(404).json({
                success: false,
                message: "Seller not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: seller,
        });
    }
    catch (error) {
        console.error("Error fetching seller:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch seller.",
        });
    }
};
exports.getSellerDetailController = getSellerDetailController;
const updateSellerStatusController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid seller ID.",
            });
            return;
        }
        const { isActive } = req.body;
        if (typeof isActive !== "boolean") {
            res.status(400).json({
                success: false,
                message: "isActive (boolean) is required.",
            });
            return;
        }
        const seller = await sellerManagementService_1.sellerManagementService.updateSellerStatus(id, isActive);
        res.status(200).json({
            success: true,
            data: seller,
            message: `Seller ${isActive ? "activated" : "deactivated"} successfully.`,
        });
    }
    catch (error) {
        console.error("Error updating seller status:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update seller status.",
        });
    }
};
exports.updateSellerStatusController = updateSellerStatusController;
const getLocationsController = async (req, res) => {
    try {
        const locations = await sellerManagementService_1.sellerManagementService.getLocations();
        res.status(200).json({ success: true, data: locations });
    }
    catch (error) {
        console.error("Error fetching locations:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch locations.",
        });
    }
};
exports.getLocationsController = getLocationsController;
const updateSellerTrustBadgesController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid seller ID.",
            });
            return;
        }
        const { badges } = req.body;
        if (!Array.isArray(badges)) {
            res.status(400).json({
                success: false,
                message: "badges (array) is required.",
            });
            return;
        }
        const seller = await sellerManagementService_1.sellerManagementService.updateSellerTrustBadges(id, badges);
        res.status(200).json({
            success: true,
            data: seller,
            message: "Seller trust badges updated successfully.",
        });
    }
    catch (error) {
        console.error("Error updating seller trust badges:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update seller trust badges.",
        });
    }
};
exports.updateSellerTrustBadgesController = updateSellerTrustBadgesController;
const deactivateSellerAccountController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid seller ID.",
            });
            return;
        }
        const { reason } = req.body;
        const seller = await sellerManagementService_1.sellerManagementService.deactivateSellerAccount(id, reason);
        res.status(200).json({
            success: true,
            data: seller,
            message: "Seller account deactivated successfully.",
        });
    }
    catch (error) {
        console.error("Error deactivating seller account:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to deactivate seller account.",
        });
    }
};
exports.deactivateSellerAccountController = deactivateSellerAccountController;
