import { Request, Response } from "express";
import { productService } from "../services/productService";
import { validateProduct } from "../validations/productValidation";

export const getProducts = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await productService.getAllProducts();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
    });
  }
};

export const getProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product.",
    });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const errors = validateProduct(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const {
      name,
      slug,
      description,
      price,
      stock,
      thumbnail,
      featured,
      categoryId,
      brandId,
    } = req.body;

    const product = await productService.createProduct({
      name,
      slug,
      description,
      price: Number(price),
      stock: Number(stock),
      thumbnail,
      featured,
      categoryId: Number(categoryId),
      brandId: Number(brandId),
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create product.",
    });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const errors = validateProduct(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const product = await productService.updateProduct(id, req.body);

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update product.",
    });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await productService.deleteProduct(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product.",
    });
  }
};