"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = void 0;
const prisma_1 = require("../config/prisma");
exports.categoryService = {
    async getAllCategories() {
        return prisma_1.prisma.category.findMany({
            orderBy: {
                name: "asc",
            },
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });
    },
    async getCategoryById(id) {
        return prisma_1.prisma.category.findUnique({
            where: { id },
            include: {
                products: true,
            },
        });
    },
    async createCategory(data) {
        const existing = await prisma_1.prisma.category.findUnique({
            where: {
                name: data.name.trim(),
            },
        });
        if (existing) {
            throw new Error("Category already exists.");
        }
        return prisma_1.prisma.category.create({
            data: {
                name: data.name.trim(),
                description: data.description?.trim(),
            },
        });
    },
    async updateCategory(id, data) {
        const category = await prisma_1.prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new Error("Category not found.");
        }
        if (data.name) {
            const existing = await prisma_1.prisma.category.findFirst({
                where: {
                    name: data.name.trim(),
                    NOT: {
                        id,
                    },
                },
            });
            if (existing) {
                throw new Error("Another category with this name already exists.");
            }
        }
        return prisma_1.prisma.category.update({
            where: { id },
            data: {
                ...(data.name && {
                    name: data.name.trim(),
                }),
                ...(data.description !== undefined && {
                    description: data.description.trim(),
                }),
            },
        });
    },
    async deleteCategory(id) {
        const category = await prisma_1.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });
        if (!category) {
            throw new Error("Category not found.");
        }
        if (category._count.products > 0) {
            throw new Error("Cannot delete category because it contains products.");
        }
        return prisma_1.prisma.category.delete({
            where: { id },
        });
    },
};
