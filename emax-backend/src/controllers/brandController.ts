import { Request, Response } from "express";
import { brandService } from "../services/brandService";

export const getBrands = async (
  req: Request,
  res: Response
) => {
  try {
    const brands = await brandService.getAllBrands();

    res.json({
      success: true,
      count: brands.length,
      data: brands,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch brands.",
    });
  }
};

export const getBrand = async (
  req: Request,
  res: Response
) => {
  try {
    const brand = await brandService.getBrandById(
      Number(req.params.id)
    );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
    }

    res.json({
      success: true,
      data: brand,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch brand.",
    });
  }
};

export const createBrand = async (
  req: Request,
  res: Response
) => {
  try {
    const brand = await brandService.createBrand(req.body);

    res.status(201).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create brand.",
    });
  }
};

export const updateBrand = async (
  req: Request,
  res: Response
) => {
  try {
    const brand = await brandService.updateBrand(
      Number(req.params.id),
      req.body
    );

    res.json({
      success: true,
      data: brand,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update brand.",
    });
  }
};

export const deleteBrand = async (
  req: Request,
  res: Response
) => {
  try {
    await brandService.deleteBrand(
      Number(req.params.id)
    );

    res.json({
      success: true,
      message: "Brand deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete brand.",
    });
  }
};