"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.updateBrand = exports.createBrand = exports.getBrand = exports.getBrands = void 0;
const brandService_1 = require("../services/brandService");
const getBrands = async (req, res) => {
    try {
        const brands = await brandService_1.brandService.getAllBrands();
        res.status(200).json({
            success: true,
            count: brands.length,
            data: brands,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch brands.",
        });
    }
};
exports.getBrands = getBrands;
const getBrand = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid brand ID.",
            });
            return;
        }
        const brand = await brandService_1.brandService.getBrandById(id);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch brand.",
        });
    }
};
exports.getBrand = getBrand;
const createBrand = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            res.status(400).json({
                success: false,
                message: "Brand name is required.",
            });
            return;
        }
        const logo = req.file?.filename || req.body.logo;
        const brand = await brandService_1.brandService.createBrand({
            name: name.trim(),
            logo,
        });
        res.status(201).json({
            success: true,
            message: "Brand created successfully.",
            data: brand,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create brand.",
        });
    }
};
exports.createBrand = createBrand;
const updateBrand = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid brand ID.",
            });
            return;
        }
        const existing = await brandService_1.brandService.getBrandById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Brand not found.",
            });
            return;
        }
        const logo = req.file?.filename || req.body.logo;
        const brand = await brandService_1.brandService.updateBrand(id, {
            name: req.body.name,
            logo,
        });
        res.status(200).json({
            success: true,
            message: "Brand updated successfully.",
            data: brand,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update brand.",
        });
    }
};
exports.updateBrand = updateBrand;
const deleteBrand = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid brand ID.",
            });
            return;
        }
        const existing = await brandService_1.brandService.getBrandById(id);
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Brand not found.",
            });
            return;
        }
        await brandService_1.brandService.deleteBrand(id);
        res.status(200).json({
            success: true,
            message: "Brand deleted successfully.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete brand.",
        });
    }
};
exports.deleteBrand = deleteBrand;
