"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPerformanceReport = exports.getCustomerReport = exports.getInventoryReport = exports.getFinanceReport = exports.getSalesReport = void 0;
const reportService = __importStar(require("../services/reportService"));
const getSalesReport = async (req, res) => {
    try {
        const { dateFrom, dateTo } = req.query;
        const data = await reportService.getSalesReport(dateFrom, dateTo);
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        console.error("Sales Report Error:", error);
        res.status(500).json({ success: false, message: "Failed to generate sales report." });
    }
};
exports.getSalesReport = getSalesReport;
const getFinanceReport = async (req, res) => {
    try {
        const { dateFrom, dateTo } = req.query;
        const data = await reportService.getFinanceReport(dateFrom, dateTo);
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        console.error("Finance Report Error:", error);
        res.status(500).json({ success: false, message: "Failed to generate finance report." });
    }
};
exports.getFinanceReport = getFinanceReport;
const getInventoryReport = async (req, res) => {
    try {
        const data = await reportService.getInventoryReport();
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        console.error("Inventory Report Error:", error);
        res.status(500).json({ success: false, message: "Failed to generate inventory report." });
    }
};
exports.getInventoryReport = getInventoryReport;
const getCustomerReport = async (req, res) => {
    try {
        const { dateFrom, dateTo } = req.query;
        const data = await reportService.getCustomerReport(dateFrom, dateTo);
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        console.error("Customer Report Error:", error);
        res.status(500).json({ success: false, message: "Failed to generate customer report." });
    }
};
exports.getCustomerReport = getCustomerReport;
const getPerformanceReport = async (req, res) => {
    try {
        const { dateFrom, dateTo } = req.query;
        const data = await reportService.getPerformanceReport(dateFrom, dateTo);
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        console.error("Performance Report Error:", error);
        res.status(500).json({ success: false, message: "Failed to generate performance report." });
    }
};
exports.getPerformanceReport = getPerformanceReport;
