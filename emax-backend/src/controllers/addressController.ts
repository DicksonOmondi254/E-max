import { Request, Response } from "express";
import { addressService } from "../services/addressService";

export const addressController = {
  // ── Get All Addresses ──
  async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id as number;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized." });
      }

      const addresses = await addressService.getAllByUser(userId);
      res.status(200).json({ success: true, data: addresses });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ── Get Single Address ──
  async getById(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id as number;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized." });
      }

      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid address ID." });
      }

      const address = await addressService.getById(id, userId);
      res.status(200).json({ success: true, data: address });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  // ── Create Address ──
  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id as number;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized." });
      }

      const address = await addressService.create(userId, req.body);
      res.status(201).json({
        success: true,
        message: "Address added successfully.",
        data: address,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // ── Update Address ──
  async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id as number;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized." });
      }

      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid address ID." });
      }

      const address = await addressService.update(id, userId, req.body);
      res.status(200).json({
        success: true,
        message: "Address updated successfully.",
        data: address,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // ── Set Default Address ──
  async setDefault(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id as number;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized." });
      }

      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid address ID." });
      }

      const address = await addressService.setDefault(id, userId);
      res.status(200).json({
        success: true,
        message: "Default address updated.",
        data: address,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // ── Delete Address ──
  async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id as number;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized." });
      }

      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid address ID." });
      }

      const result = await addressService.delete(id, userId);
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};

