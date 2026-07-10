import { Request, Response } from "express";
import { categoryService } from "../services/categoryService";

export const getCategories = async (
  req: Request,
  res: Response
) => {
  try {
    const categories =
      await categoryService.getAllCategories();

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories.",
    });
  }
};

export const getCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const category =
      await categoryService.getCategoryById(
        Number(req.params.id)
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch category.",
    });
  }
};

export const createCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const category =
      await categoryService.createCategory(req.body);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create category.",
    });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const category =
      await categoryService.updateCategory(
        Number(req.params.id),
        req.body
      );

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update category.",
    });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
) => {
  try {
    await categoryService.deleteCategory(
      Number(req.params.id)
    );

    res.json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete category.",
    });
  }
};