"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shippingController = void 0;
const shippingService_1 = require("../services/shippingService");
exports.shippingController = {
    // ── Get All Shipping Zones ──
    async getAllZones(req, res) {
        try {
            const zones = await shippingService_1.shippingService.getAllZones();
            res.status(200).json({
                success: true,
                data: zones,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    // ── Get Shipping Zone by ID ──
    async getZoneById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const zone = await shippingService_1.shippingService.getZoneById(id);
            res.status(200).json({
                success: true,
                data: zone,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    },
    // ── Create Shipping Zone ──
    async createZone(req, res) {
        try {
            const zone = await shippingService_1.shippingService.createZone(req.body);
            res.status(201).json({
                success: true,
                message: "Shipping zone created successfully.",
                data: zone,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    },
    // ── Update Shipping Zone ──
    async updateZone(req, res) {
        try {
            const id = parseInt(req.params.id);
            const zone = await shippingService_1.shippingService.updateZone(id, req.body);
            res.status(200).json({
                success: true,
                message: "Shipping zone updated successfully.",
                data: zone,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    },
    // ── Delete Shipping Zone ──
    async deleteZone(req, res) {
        try {
            const id = parseInt(req.params.id);
            await shippingService_1.shippingService.deleteZone(id);
            res.status(200).json({
                success: true,
                message: "Shipping zone deleted successfully.",
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    },
    // ── Get Shipping Settings ──
    async getSettings(req, res) {
        try {
            const settings = await shippingService_1.shippingService.getSettings();
            res.status(200).json({
                success: true,
                data: settings,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    // ── Update Shipping Settings ──
    async updateSettings(req, res) {
        try {
            const settings = await shippingService_1.shippingService.updateSettings(req.body);
            res.status(200).json({
                success: true,
                message: "Shipping settings updated successfully.",
                data: settings,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    },
};
