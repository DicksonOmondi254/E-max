import { Request, Response } from "express";
import * as reportService from "../services/reportService";

export const getSalesReport = async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo } = req.query;
    const data = await reportService.getSalesReport(dateFrom as string, dateTo as string);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Sales Report Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate sales report." });
  }
};

export const getFinanceReport = async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo } = req.query;
    const data = await reportService.getFinanceReport(dateFrom as string, dateTo as string);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Finance Report Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate finance report." });
  }
};

export const getInventoryReport = async (req: Request, res: Response) => {
  try {
    const data = await reportService.getInventoryReport();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Inventory Report Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate inventory report." });
  }
};

export const getCustomerReport = async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo } = req.query;
    const data = await reportService.getCustomerReport(dateFrom as string, dateTo as string);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Customer Report Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate customer report." });
  }
};

export const getPerformanceReport = async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo } = req.query;
    const data = await reportService.getPerformanceReport(dateFrom as string, dateTo as string);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Performance Report Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate performance report." });
  }
};

