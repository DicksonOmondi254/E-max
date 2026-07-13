import { Request, Response } from "express";
import { brandService } from "../services/brandService";

export const getBrands = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const brands = await brandService.getAllBrands();

    res.status(200).json({
      success: true,
      count: brands.length,
      data: brands,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch brands.",
    });
  }
};

export const getBrand = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid brand ID.",
      });
      return;
    }

    const brand = await brandService.getBrandById(id);

    if (!brand) {
      res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch brand.",
    });
  }
};

export const createBrand = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({
        success: false,
        message: "Brand name is required.",
      });
      return;
    }

    const logo =
      (req as any).file?.filename || req.body.logo;

    const brand = await brandService.createBrand({
      name: name.trim(),
      logo,
    });

    res.status(201).json({
      success: true,
      message: "Brand created successfully.",
      data: brand,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create brand.",
    });
  }
};

export const updateBrand = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid brand ID.",
      });
      return;
    }

    const existing =
      await brandService.getBrandById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
      return;
    }

    const logo =
      (req as any).file?.filename || req.body.logo;

    const brand = await brandService.updateBrand(id, {
      name: req.body.name,
      logo,
    });

    res.status(200).json({
      success: true,
      message: "Brand updated successfully.",
      data: brand,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update brand.",
    });
  }
};

export const deleteBrand = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid brand ID.",
      });
      return;
    }

    const existing =
      await brandService.getBrandById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
      return;
    }

    await brandService.deleteBrand(id);

    res.status(200).json({
      success: true,
      message: "Brand deleted successfully.",
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete brand.",
    });
  }
};