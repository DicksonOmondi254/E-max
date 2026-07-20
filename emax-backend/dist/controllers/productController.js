"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleProductStatus = exports.toggleFeatured = exports.getProductBySlug = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getProducts = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const productService_1 = require("../services/productService");
const productValidation_1 = require("../validations/productValidation");
const UPLOAD_PATH = path_1.default.join(process.cwd(), "uploads", "products");
/* =====================================================
   GET PRODUCTS (SEARCH / FILTER / SORT / PAGINATION)
===================================================== */
const getProducts = async (req, res) => {
    try {
        const { search, category, brand, featured, active, minPrice, maxPrice, page, limit, sort, } = req.query;
        const result = await productService_1.productService.getProducts({
            search: search
                ? String(search)
                : undefined,
            category: category
                ? Number(category)
                : undefined,
            brand: brand
                ? Number(brand)
                : undefined,
            featured: featured === undefined
                ? undefined
                : featured === "true",
            active: active === undefined
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to fetch products.",
        });
    }
};
exports.getProducts = getProducts;
/* =====================================================
   GET SINGLE PRODUCT
===================================================== */
const getProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID.",
            });
        }
        const product = await productService_1.productService.getProductById(id);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to fetch product.",
        });
    }
};
exports.getProduct = getProduct;
/* =====================================================
   CREATE PRODUCT
===================================================== */
const createProduct = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.file);
        const errors = (0, productValidation_1.validateProduct)(req.body);
        if (errors.length) {
            return res.status(400).json({
                success: false,
                errors,
            });
        }
        // Prevent duplicate slug
        const slugExists = await productService_1.productService.getProductBySlug(req.body.slug);
        if (slugExists) {
            return res.status(400).json({
                success: false,
                message: "A product with this slug already exists.",
            });
        }
        const thumbnail = req.file
            ? req.file.filename
            : "";
        const product = await productService_1.productService.createProduct({
            name: req.body.name,
            slug: req.body.slug,
            description: req.body.description,
            price: Number(req.body.price),
            stock: Number(req.body.stock),
            featured: req.body.featured === true ||
                req.body.featured === "true",
            thumbnail,
            categoryId: Number(req.body.categoryId),
            brandId: Number(req.body.brandId),
        });
        res.status(201).json({
            success: true,
            message: "Product created successfully.",
            data: product,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to create product.",
        });
    }
};
exports.createProduct = createProduct;
/* =====================================================
   UPDATE PRODUCT
===================================================== */
const updateProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const existing = await productService_1.productService.getProductById(id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }
        const errors = (0, productValidation_1.validateProduct)(req.body);
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
                const imagePath = path_1.default.join(UPLOAD_PATH, existing.thumbnail);
                if (fs_1.default.existsSync(imagePath)) {
                    fs_1.default.unlinkSync(imagePath);
                }
            }
        }
        const product = await productService_1.productService.updateProduct(id, {
            name: req.body.name,
            slug: req.body.slug,
            description: req.body.description,
            price: Number(req.body.price),
            stock: Number(req.body.stock),
            featured: req.body.featured === true ||
                req.body.featured === "true",
            categoryId: Number(req.body.categoryId),
            brandId: Number(req.body.brandId),
            thumbnail,
        });
        res.json({
            success: true,
            message: "Product updated successfully.",
            data: product,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to update product.",
        });
    }
};
exports.updateProduct = updateProduct;
/* =====================================================
   DELETE PRODUCT
===================================================== */
const deleteProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const existing = await productService_1.productService.getProductById(id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }
        await productService_1.productService.deleteProduct(id);
        if (existing.thumbnail) {
            const imagePath = path_1.default.join(UPLOAD_PATH, existing.thumbnail);
            if (fs_1.default.existsSync(imagePath)) {
                fs_1.default.unlinkSync(imagePath);
            }
        }
        res.json({
            success: true,
            message: "Product deleted successfully.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to delete product.",
        });
    }
};
exports.deleteProduct = deleteProduct;
/* =====================================================
   GET PRODUCT BY SLUG
===================================================== */
const getProductBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        const product = await productService_1.productService.getProductBySlug(slug);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to fetch product.",
        });
    }
};
exports.getProductBySlug = getProductBySlug;
/* =====================================================
   TOGGLE FEATURED
===================================================== */
const toggleFeatured = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID.",
            });
        }
        const product = await productService_1.productService.toggleFeatured(id);
        res.status(200).json({
            success: true,
            message: "Product featured status updated.",
            data: product,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to update featured status.",
        });
    }
};
exports.toggleFeatured = toggleFeatured;
/* =====================================================
   TOGGLE PRODUCT STATUS
===================================================== */
const toggleProductStatus = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID.",
            });
        }
        const product = await productService_1.productService.toggleStatus(id);
        res.status(200).json({
            success: true,
            message: "Product status updated.",
            data: product,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to update product status.",
        });
    }
};
exports.toggleProductStatus = toggleProductStatus;
