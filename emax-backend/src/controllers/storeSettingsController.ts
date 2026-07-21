import { Request, Response } from "express";
import { storeSettingsService } from "../services/storeSettingsService";

export const storeSettingsController = {
  // ── Get Store Settings ──
  async getSettings(req: Request, res: Response) {
    try {
      const settings = await storeSettingsService.getSettings();
      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // ── Update Store Settings ──
  async updateSettings(req: Request, res: Response) {
    try {
      const settings = await storeSettingsService.updateSettings(req.body);
      res.status(200).json({
        success: true,
        message: "Store settings updated successfully.",
        data: settings,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};

