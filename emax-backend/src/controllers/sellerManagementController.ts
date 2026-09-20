import { Request, Response } from "express";
import { sellerManagementService } from "../services/sellerManagementService";

export const getSellerStatsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats = await sellerManagementService.getSellerStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error: any) {
    console.error("Error fetching seller stats:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch seller stats.",
    });
  }
};

export const getAllSellersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const search = (req.query.search as string) || undefined;
    const status = (req.query.status as string) || undefined;
    const location = (req.query.location as string) || undefined;
    const dateFrom = (req.query.dateFrom as string) || undefined;
    const dateTo = (req.query.dateTo as string) || undefined;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

    const result = await sellerManagementService.getAllSellers(
      page,
      limit,
      search,
      status,
      location,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error fetching sellers:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch sellers.",
    });
  }
};

export const getSellerDetailController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid seller ID.",
      });
      return;
    }

    const seller = await sellerManagementService.getSellerById(id);

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
  } catch (error: any) {
    console.error("Error fetching seller:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch seller.",
    });
  }
};

export const updateSellerStatusController = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    const seller = await sellerManagementService.updateSellerStatus(id, isActive);

    res.status(200).json({
      success: true,
      data: seller,
      message: `Seller ${isActive ? "activated" : "deactivated"} successfully.`,
    });
  } catch (error: any) {
    console.error("Error updating seller status:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update seller status.",
    });
  }
};

export const getLocationsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const locations = await sellerManagementService.getLocations();
    res.status(200).json({ success: true, data: locations });
  } catch (error: any) {
    console.error("Error fetching locations:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch locations.",
    });
  }
};

export const updateSellerTrustBadgesController = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    const seller = await sellerManagementService.updateSellerTrustBadges(id, badges);

    res.status(200).json({
      success: true,
      data: seller,
      message: "Seller trust badges updated successfully.",
    });
  } catch (error: any) {
    console.error("Error updating seller trust badges:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update seller trust badges.",
    });
  }
};

export const deactivateSellerAccountController = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    const seller = await sellerManagementService.deactivateSellerAccount(id, reason);

    res.status(200).json({
      success: true,
      data: seller,
      message: "Seller account deactivated successfully.",
    });
  } catch (error: any) {
    console.error("Error deactivating seller account:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to deactivate seller account.",
    });
  }
};
