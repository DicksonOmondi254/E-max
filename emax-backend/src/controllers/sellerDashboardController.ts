import { Request, Response } from "express";
import {
  getSellerDashboardStats,
  getSellerProducts,
  getSellerOrders,
  updateSellerOrderStatus,
  getSellerEarnings,
  getSellerReturns,
  getSellerReviews,
  getSellerPerformance,
  getSellerProfile,
  updateSellerProfile,
  createFlashSale,
  getSellerFlashSales as getSellerFlashSalesService,
  getFlashSaleById as getFlashSaleByIdService,
  deleteFlashSale as deleteFlashSaleService,
  createBulkDiscountService,
  getSellerBulkDiscounts as getSellerBulkDiscountsService,
  getBulkDiscountById as getBulkDiscountByIdService,
  deleteBulkDiscount as deleteBulkDiscountService,
  getSellerLocation,
  updateSellerLocation,
  checkSellerDeactivationStatus,
} from "../services/sellerDashboardService";

const getUserId = (req: Request): number | null => req.user?.id ?? null;

const handleRequest = async (
  req: Request,
  res: Response,
  handler: (userId: number) => Promise<any>
) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }
    const data = await handler(userId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error("Seller Controller Error:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};

// Dashboard
export const getSellerStats = async (req: Request, res: Response) => {
  await handleRequest(req, res, (userId) => getSellerDashboardStats(userId));
};

// Products
export const getSellerProductsList = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const q = req.query as Record<string, string | undefined>;
    const result = await getSellerProducts(userId, {
      search: q.search,
      active: q.active,
      featured: q.featured,
      page: q.page ? parseInt(q.page, 10) : undefined,
      limit: q.limit ? parseInt(q.limit, 10) : undefined,
    });

    res.status(200).json({ success: true, data: result.data, pagination: { page: result.page, limit: result.limit, total: result.total, pages: result.pages } });
  } catch (error: any) {
    console.error("Seller Products Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to load products." });
  }
};

// Orders
export const getSellerOrdersList = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const q = req.query as Record<string, string | undefined>;
    const result = await getSellerOrders(userId, {
      status: q.status,
      search: q.search,
      page: q.page ? parseInt(q.page, 10) : undefined,
      limit: q.limit ? parseInt(q.limit, 10) : undefined,
    });

    res.status(200).json({ success: true, data: result.data, pagination: { page: result.page, limit: result.limit, total: result.total, pages: result.pages } });
  } catch (error: any) {
    console.error("Seller Orders Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to load orders." });
  }
};

// Update Order Status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const id = parseInt(String(req.params.id), 10);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required." });
    }

    const order = await updateSellerOrderStatus(userId, id, status);
    res.status(200).json({ success: true, data: order });
  } catch (error: any) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update order status." });
  }
};

// Earnings
export const getSellerEarningsList = async (req: Request, res: Response) => {
  await handleRequest(req, res, (userId) => getSellerEarnings(userId));
};

// Returns
export const getSellerReturnsList = async (req: Request, res: Response) => {
  await handleRequest(req, res, (userId) => getSellerReturns(userId));
};

// Reviews
export const getSellerReviewsList = async (req: Request, res: Response) => {
  await handleRequest(req, res, (userId) => getSellerReviews(userId));
};

// Performance
export const getSellerPerformanceData = async (req: Request, res: Response) => {
  await handleRequest(req, res, (userId) => getSellerPerformance(userId));
};

// Profile
export const getSellerProfileData = async (req: Request, res: Response) => {
  await handleRequest(req, res, (userId) => getSellerProfile(userId));
};

/* ── Flash Sales ── */

const createFlashSaleController = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const { title, description, discountPercentage, startDate, endDate, productIds } = req.body;

    if (!title || !discountPercentage || !startDate || !endDate || !productIds?.length) {
      return res.status(400).json({ success: false, message: "Missing required fields: title, discountPercentage, startDate, endDate, productIds." });
    }

    const flashSale = await createFlashSale(userId, {
      title,
      description,
      discountPercentage,
      startDate,
      endDate,
      productIds,
    });

    res.status(201).json({ success: true, data: flashSale });
  } catch (error: any) {
    console.error("Create Flash Sale Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to create flash sale." });
  }
};

const getSellerFlashSalesController = async (req: Request, res: Response) => {
  await handleRequest(req, res, (userId) => getSellerFlashSalesService(userId));
};

const getFlashSaleByIdController = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const flashSaleId = parseInt(String(req.params.id), 10);
    const flashSale = await getFlashSaleByIdService(userId, flashSaleId);

    if (!flashSale) {
      return res.status(404).json({ success: false, message: "Flash sale not found." });
    }

    res.status(200).json({ success: true, data: flashSale });
  } catch (error: any) {
    console.error("Get Flash Sale Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to get flash sale." });
  }
};

const deleteFlashSaleController = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const flashSaleId = parseInt(String(req.params.id), 10);
    await deleteFlashSaleService(userId, flashSaleId);

    res.status(200).json({ success: true, message: "Flash sale deleted successfully." });
  } catch (error: any) {
    console.error("Delete Flash Sale Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to delete flash sale." });
  }
};

export {
  createFlashSaleController,
  getSellerFlashSalesController,
  getFlashSaleByIdController,
  deleteFlashSaleController,
};

/* ── Bulk Discounts ── */

const createBulkDiscountController = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const { name, description, startDate, endDate, productIds, tiers } = req.body;

    if (!name || !startDate || !endDate || !productIds?.length || !tiers?.length) {
      return res.status(400).json({ success: false, message: "Missing required fields: name, startDate, endDate, productIds, tiers." });
    }

    const bulkDiscount = await createBulkDiscountService(userId, {
      name,
      description,
      startDate,
      endDate,
      productIds,
      tiers,
    });

    res.status(201).json({ success: true, data: bulkDiscount });
  } catch (error: any) {
    console.error("Create Bulk Discount Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to create bulk discount." });
  }
};

const getSellerBulkDiscountsController = async (req: Request, res: Response) => {
  await handleRequest(req, res, (userId) => getSellerBulkDiscountsService(userId));
};

const getBulkDiscountByIdController = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const bulkDiscountId = parseInt(String(req.params.id), 10);
    const bulkDiscount = await getBulkDiscountByIdService(userId, bulkDiscountId);

    if (!bulkDiscount) {
      return res.status(404).json({ success: false, message: "Bulk discount not found." });
    }

    res.status(200).json({ success: true, data: bulkDiscount });
  } catch (error: any) {
    console.error("Get Bulk Discount Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to get bulk discount." });
  }
};

const deleteBulkDiscountController = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const bulkDiscountId = parseInt(String(req.params.id), 10);
    await deleteBulkDiscountService(userId, bulkDiscountId);

    res.status(200).json({ success: true, message: "Bulk discount deleted successfully." });
  } catch (error: any) {
    console.error("Delete Bulk Discount Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to delete bulk discount." });
  }
};

export {
  createBulkDiscountController,
  getSellerBulkDiscountsController,
  getBulkDiscountByIdController,
  deleteBulkDiscountController,
};

export const updateSellerProfileData = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

const { shopName, shopDescription, phone, shopLogo, shopBanner, trustBadges } = req.body;
    const updatedProfile = await updateSellerProfile(userId, {
      shopName,
      shopDescription,
      phone,
      shopLogo,
      shopBanner,
      trustBadges,
    });

    res.status(200).json({ success: true, data: updatedProfile, message: "Profile updated successfully." });
  } catch (error: any) {
    console.error("Update Seller Profile Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update profile." });
  }
};

/* ── Seller Location ── */

export const getSellerLocationController = async (req: Request, res: Response) => {
  await handleRequest(req, res, (userId) => getSellerLocation(userId));
};

export const updateSellerLocationController = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const { addressLine1, addressLine2, city, state, country, postalCode } = req.body;
    const location = await updateSellerLocation(userId, { addressLine1, addressLine2, city, state, country, postalCode });

    res.status(200).json({ success: true, data: location, message: "Location updated successfully." });
  } catch (error: any) {
    console.error("Update Seller Location Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update location." });
  }
};

/* ── Deactivation Check ── */

export const checkSellerDeactivationController = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const result = await checkSellerDeactivationStatus(userId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error("Deactivation Check Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to check deactivation status." });
  }
};

