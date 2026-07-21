"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerManagementService = void 0;
const prisma_1 = require("../config/prisma");
exports.customerManagementService = {
    async getAllCustomers(page = 1, limit = 20, search, sortBy = "createdAt", sortOrder = "desc") {
        const skip = (page - 1) * limit;
        const where = {
            role: "CUSTOMER",
        };
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
            ];
        }
        const allowedSortFields = [
            "firstName",
            "lastName",
            "email",
            "createdAt",
            "updatedAt",
            "isVerified",
        ];
        const field = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
        const [customers, total] = await Promise.all([
            prisma_1.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [field]: sortOrder },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    role: true,
                    isVerified: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            orders: true,
                            reviews: true,
                        },
                    },
                },
            }),
            prisma_1.prisma.user.count({ where }),
        ]);
        return {
            customers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },
    async getCustomerById(id) {
        return prisma_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                role: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        orders: true,
                        reviews: true,
                    },
                },
                orders: {
                    take: 5,
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        orderNumber: true,
                        totalAmount: true,
                        status: true,
                        paymentStatus: true,
                        createdAt: true,
                    },
                },
            },
        });
    },
};
