import { Request, Response } from "express";
import { categoryService } from "../services/categoryService";

export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories =
      await categoryService.getAllCategories();

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch categories.",
    });
  }
};

export const getCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid category ID.",
      });
      return;
    }

    const category =
      await categoryService.getCategoryById(id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch category.",
    });
  }
};

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
      return;
    }

    const category =
      await categoryService.createCategory({
        name: name.trim(),
        description,
      });

    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create category.",
    });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid category ID.",
      });
      return;
    }

    const existing =
      await categoryService.getCategoryById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Category not found.",
      });
      return;
    }

    const category =
      await categoryService.updateCategory(
        id,
        req.body
      );

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update category.",
    });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid category ID.",
      });
      return;
    }

    const existing =
      await categoryService.getCategoryById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Category not found.",
      });
      return;
    }

    await categoryService.deleteCategory(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete category.",
    });
  }
};