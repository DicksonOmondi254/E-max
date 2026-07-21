"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeSettingsController = void 0;
const storeSettingsService_1 = require("../services/storeSettingsService");
exports.storeSettingsController = {
    // ── Get Store Settings ──
    async getSettings(req, res) {
        try {
            const settings = await storeSettingsService_1.storeSettingsService.getSettings();
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
    // ── Update Store Settings ──
    async updateSettings(req, res) {
        try {
            const settings = await storeSettingsService_1.storeSettingsService.updateSettings(req.body);
            res.status(200).json({
                success: true,
                message: "Store settings updated successfully.",
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
