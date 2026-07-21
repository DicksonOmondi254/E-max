import { Request, Response } from "express";
import { shippingService } from "../services/shippingService";

export const shippingController = {
  // ── Get All Shipping Zones ──
  async getAllZones(req: Request, res: Response) {
    try {
      const zones = await shippingService.getAllZones();
      res.status(200).json({
        success: true,
        data: zones,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // ── Get Shipping Zone by ID ──
  async getZoneById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const zone = await shippingService.getZoneById(id);
      res.status(200).json({
        success: true,
        data: zone,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  },

  // ── Create Shipping Zone ──
  async createZone(req: Request, res: Response) {
    try {
      const zone = await shippingService.createZone(req.body);
      res.status(201).json({
        success: true,
        message: "Shipping zone created successfully.",
        data: zone,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // ── Update Shipping Zone ──
  async updateZone(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const zone = await shippingService.updateZone(id, req.body);
      res.status(200).json({
        success: true,
        message: "Shipping zone updated successfully.",
        data: zone,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // ── Delete Shipping Zone ──
  async deleteZone(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      await shippingService.deleteZone(id);
      res.status(200).json({
        success: true,
        message: "Shipping zone deleted successfully.",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // ── Get Shipping Settings ──
  async getSettings(req: Request, res: Response) {
    try {
      const settings = await shippingService.getSettings();
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

  // ── Update Shipping Settings ──
  async updateSettings(req: Request, res: Response) {
    try {
      const settings = await shippingService.updateSettings(req.body);
      res.status(200).json({
        success: true,
        message: "Shipping settings updated successfully.",
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

