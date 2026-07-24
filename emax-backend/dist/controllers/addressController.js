"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressController = void 0;
const addressService_1 = require("../services/addressService");
exports.addressController = {
    // ── Get All Addresses ──
    async getAll(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized." });
            }
            const addresses = await addressService_1.addressService.getAllByUser(userId);
            res.status(200).json({ success: true, data: addresses });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    // ── Get Single Address ──
    async getById(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized." });
            }
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: "Invalid address ID." });
            }
            const address = await addressService_1.addressService.getById(id, userId);
            res.status(200).json({ success: true, data: address });
        }
        catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    },
    // ── Create Address ──
    async create(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized." });
            }
            const address = await addressService_1.addressService.create(userId, req.body);
            res.status(201).json({
                success: true,
                message: "Address added successfully.",
                data: address,
            });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },
    // ── Update Address ──
    async update(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized." });
            }
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: "Invalid address ID." });
            }
            const address = await addressService_1.addressService.update(id, userId, req.body);
            res.status(200).json({
                success: true,
                message: "Address updated successfully.",
                data: address,
            });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },
    // ── Set Default Address ──
    async setDefault(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized." });
            }
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: "Invalid address ID." });
            }
            const address = await addressService_1.addressService.setDefault(id, userId);
            res.status(200).json({
                success: true,
                message: "Default address updated.",
                data: address,
            });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },
    // ── Delete Address ──
    async delete(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized." });
            }
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: "Invalid address ID." });
            }
            const result = await addressService_1.addressService.delete(id, userId);
            res.status(200).json({ success: true, ...result });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },
};
