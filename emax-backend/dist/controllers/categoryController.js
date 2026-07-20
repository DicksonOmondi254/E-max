"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategory = exports.getCategories = void 0;
const categoryService_1 = require("../services/categoryService");
const getCategories = async (req, res) => {
    try {
        const categories = await categoryService_1.categoryService.getAllCategories();
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch categories.",
        });
    }
};
exports.getCategories = getCategories;
const getCategory = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid category ID.",
            });
            return;
        }
        const category = await categoryService_1.categoryService.getCategoryById(id);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch category.",
        });
    }
};
exports.getCategory = getCategory;
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !name.trim()) {
            res.status(400).json({
                success: false,
                message: "Category name is required.",
            });
            return;
        }
        const category = await categoryService_1.categoryService.createCategory({
            name: name.trim(),
            description,
        });
        res.status(201).json({
            success: true,
            message: "Category created successfully.",
            data: category,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create category.",
        });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid category ID.",
            });
            return;
        }
        const existing = await categoryService_1.categoryService.getCategoryById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Category not found.",
            });
            return;
        }
        const category = await categoryService_1.categoryService.updateCategory(id, req.body);
        res.status(200).json({
            success: true,
            message: "Category updated successfully.",
            data: category,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update category.",
        });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid category ID.",
            });
            return;
        }
        const existing = await categoryService_1.categoryService.getCategoryById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Category not found.",
            });
            return;
        }
        await categoryService_1.categoryService.deleteCategory(id);
        res.status(200).json({
            success: true,
            message: "Category deleted successfully.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete category.",
        });
    }
};
exports.deleteCategory = deleteCategory;
