"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerDetail = exports.getAllCustomers = void 0;
const customerManagementService_1 = require("../services/customerManagementService");
const getAllCustomers = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const search = req.query.search || undefined;
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder || "desc";
        const result = await customerManagementService_1.customerManagementService.getAllCustomers(page, limit, search, sortBy, sortOrder);
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch customers.",
        });
    }
};
exports.getAllCustomers = getAllCustomers;
const getCustomerDetail = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid customer ID.",
            });
            return;
        }
        const customer = await customerManagementService_1.customerManagementService.getCustomerById(id);
        if (!customer) {
            res.status(404).json({
                success: false,
                message: "Customer not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: customer,
        });
    }
    catch (error) {
        console.error("Error fetching customer:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch customer.",
        });
    }
};
exports.getCustomerDetail = getCustomerDetail;
