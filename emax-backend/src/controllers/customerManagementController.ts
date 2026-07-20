import { Request, Response } from "express";
import { customerManagementService } from "../services/customerManagementService";

export const getAllCustomers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const search = (req.query.search as string) || undefined;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

    const result = await customerManagementService.getAllCustomers(
      page,
      limit,
      search,
      sortBy,
      sortOrder
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch customers.",
    });
  }
};

export const getCustomerDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid customer ID.",
      });
      return;
    }

    const customer = await customerManagementService.getCustomerById(id);

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
  } catch (error: any) {
    console.error("Error fetching customer:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch customer.",
    });
  }
};

