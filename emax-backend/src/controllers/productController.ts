import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import { productService } from "../services/productService";
import { validateProduct } from "../validations/productValidation";

const UPLOAD_PATH = path.join(
  process.cwd(),
  "uploads",
  "products"
);

/* =====================================================
   GET PRODUCTS (SEARCH / FILTER / SORT / PAGINATION)
===================================================== */

export const getProducts = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      search,
      category,
      brand,
      featured,
      active,
      minPrice,
      maxPrice,
      page,
      limit,
      sort,
    } = req.query;

    const result = await productService.getProducts({
      search: search
        ? String(search)
        : undefined,

      category: category
        ? Number(category)
        : undefined,

      brand: brand
        ? Number(brand)
        : undefined,

      featured:
        featured === undefined
          ? undefined
          : featured === "true",

      active:
        active === undefined
          ? undefined
          : active === "true",

      minPrice: minPrice
        ? Number(minPrice)
        : undefined,

      maxPrice: maxPrice
        ? Number(maxPrice)
        : undefined,

      page: page
        ? Number(page)
        : 1,

      limit: limit
        ? Number(limit)
        : 12,

      sort: sort
        ? String(sort)
        : "newest",
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch products.",
    });
  }
};

/* =====================================================
   GET SINGLE PRODUCT
===================================================== */

export const getProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product =
      await productService.getProductById(id);

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
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch product.",
    });
  }
};

/* =====================================================
   CREATE PRODUCT
===================================================== */

export const createProduct = async (
  req: Request,
  res: Response
) => {
  try {
    console.log(req.body);
    console.log(req.file);

    const errors = validateProduct(req.body);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    // Prevent duplicate slug

    const slugExists =
      await productService.getProductBySlug(
        req.body.slug
      );

    if (slugExists) {
      return res.status(400).json({
        success: false,
        message:
          "A product with this slug already exists.",
      });
    }

    const thumbnail = req.file
      ? req.file.filename
      : "";

    const product =
      await productService.createProduct({
        name: req.body.name,
        slug: req.body.slug,
        description: req.body.description,

        price: Number(req.body.price),

        stock: Number(req.body.stock),

        featured:
          req.body.featured === true ||
          req.body.featured === "true",

        thumbnail,

        categoryId: Number(
          req.body.categoryId
        ),

        brandId: Number(req.body.brandId),
      });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create product.",
    });
  }
};

/* =====================================================
   UPDATE PRODUCT
===================================================== */

export const updateProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const existing =
      await productService.getProductById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const errors = validateProduct(req.body);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    let thumbnail = existing.thumbnail;

    if (req.file) {
      thumbnail = req.file.filename;

      // Delete old image

      if (existing.thumbnail) {
        const imagePath = path.join(
          UPLOAD_PATH,
          existing.thumbnail
        );

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    const product =
      await productService.updateProduct(id, {
        name: req.body.name,
        slug: req.body.slug,
        description: req.body.description,

        price: Number(req.body.price),

        stock: Number(req.body.stock),

        featured:
          req.body.featured === true ||
          req.body.featured === "true",

        categoryId: Number(
          req.body.categoryId
        ),

        brandId: Number(req.body.brandId),

        thumbnail,
      });

    res.json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update product.",
    });
  }
};

/* =====================================================
   DELETE PRODUCT
===================================================== */

export const deleteProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const existing =
      await productService.getProductById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await productService.deleteProduct(id);

    if (existing.thumbnail) {
      const imagePath = path.join(
        UPLOAD_PATH,
        existing.thumbnail
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete product.",
    });
  }
};
/* =====================================================
   GET PRODUCT BY SLUG
===================================================== */

export const getProductBySlug = async (
  req: Request,
  res: Response
) => {
  try {
    const slug = req.params.slug as string;

    const product =
      await productService.getProductBySlug(slug);

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
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch product.",
    });
  }
};

/* =====================================================
   TOGGLE FEATURED
===================================================== */

export const toggleFeatured = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product =
      await productService.toggleFeatured(id);

    res.status(200).json({
      success: true,
      message: "Product featured status updated.",
      data: product,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update featured status.",
    });
  }
};

/* =====================================================
   TOGGLE PRODUCT STATUS
===================================================== */

export const toggleProductStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product =
      await productService.toggleStatus(id);

    res.status(200).json({
      success: true,
      message: "Product status updated.",
      data: product,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update product status.",
    });
  }
};