"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerManagementService = void 0;
const prisma_1 = require("../config/prisma");
const emailService_1 = require("./emailService");
exports.sellerManagementService = {
    async getSellerStats() {
        const totalSellers = await prisma_1.prisma.user.count({
            where: { role: "SELLER" },
        });
        const activeSellers = await prisma_1.prisma.user.count({
            where: { role: "SELLER", isActive: true },
        });
        const inactiveSellers = totalSellers - activeSellers;
        const totalProducts = await prisma_1.prisma.product.count({
            where: { user: { role: "SELLER" } },
        });
        const activeSellersPercent = totalSellers > 0 ? Math.round((activeSellers / totalSellers) * 100) : 0;
        const inactiveSellersPercent = totalSellers > 0 ? Math.round((inactiveSellers / totalSellers) * 100) : 0;
        return {
            totalSellers,
            activeSellers,
            activeSellersPercent,
            inactiveSellers,
            inactiveSellersPercent,
            totalProducts,
        };
    },
    async getAllSellers(page = 1, limit = 20, search, status, location, dateFrom, dateTo, sortBy = "createdAt", sortOrder = "desc") {
        const skip = (page - 1) * limit;
        const where = {
            role: "SELLER",
        };
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { shopName: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
            ];
        }
        if (status === "active") {
            where.isActive = true;
        }
        else if (status === "inactive") {
            where.isActive = false;
        }
        if (location) {
            const locationOr = [
                { location: { contains: location, mode: "insensitive" } },
                { city: { contains: location, mode: "insensitive" } },
                { state: { contains: location, mode: "insensitive" } },
                { country: { contains: location, mode: "insensitive" } },
            ];
            if (where.OR) {
                where.OR = [...where.OR, ...locationOr];
            }
            else {
                where.OR = locationOr;
            }
        }
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom) {
                where.createdAt.gte = new Date(dateFrom);
            }
            if (dateTo) {
                where.createdAt.lte = new Date(dateTo);
            }
        }
        const allowedSortFields = [
            "firstName",
            "lastName",
            "email",
            "createdAt",
            "updatedAt",
            "isActive",
            "shopName",
        ];
        const field = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
        const [sellers, total] = await Promise.all([
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
                    isActive: true,
                    shopName: true,
                    trustBadges: true,
                    location: true,
                    city: true,
                    state: true,
                    country: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            products: true,
                        },
                    },
                },
            }),
            prisma_1.prisma.user.count({ where }),
        ]);
        // For each seller, count orders that contain their products
        const sellersWithOrders = await Promise.all(sellers.map(async (seller) => {
            const productIds = seller._count.products > 0
                ? (await prisma_1.prisma.product.findMany({
                    where: { userId: seller.id },
                    select: { id: true },
                })).map((p) => p.id)
                : [];
            const orderItems = productIds.length > 0
                ? await prisma_1.prisma.orderItem.findMany({
                    where: { productId: { in: productIds } },
                    select: { orderId: true },
                    distinct: ["orderId"],
                })
                : [];
            // Build a `location` JSON string for the admin dashboard. Fall back to
            // the individual address fields for sellers who set their location
            // before the `location` field was synced.
            let location = seller.location;
            if (!location && (seller.city || seller.state || seller.country)) {
                location = JSON.stringify({
                    city: seller.city || "",
                    region: seller.state || "",
                    country: seller.country || "",
                });
            }
            return {
                ...seller,
                location,
                createdAt: seller.createdAt.toISOString(),
                updatedAt: seller.updatedAt.toISOString(),
                _count: {
                    ...seller._count,
                    orders: orderItems.length,
                },
            };
        }));
        return {
            sellers: sellersWithOrders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },
    async getSellerById(id) {
        const seller = await prisma_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                role: true,
                isVerified: true,
                isActive: true,
                shopName: true,
                location: true,
                trustBadges: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        products: true,
                    },
                },
                products: {
                    take: 10,
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        price: true,
                        stock: true,
                        thumbnail: true,
                        active: true,
                        createdAt: true,
                        category: { select: { id: true, name: true } },
                        _count: { select: { orderItems: true } },
                    },
                },
            },
        });
        if (!seller || seller.role !== "SELLER")
            return null;
        const productIds = seller._count.products > 0
            ? seller.products.map((p) => p.id)
            : [];
        const orderItems = productIds.length > 0
            ? await prisma_1.prisma.orderItem.findMany({
                where: { productId: { in: productIds } },
                select: { orderId: true },
                distinct: ["orderId"],
            })
            : [];
        // Recent orders for this seller's products
        const recentOrders = productIds.length > 0
            ? await prisma_1.prisma.order.findMany({
                where: {
                    items: { some: { productId: { in: productIds } } },
                },
                orderBy: { createdAt: "desc" },
                take: 5,
                select: {
                    id: true,
                    orderNumber: true,
                    totalAmount: true,
                    status: true,
                    createdAt: true,
                    user: { select: { firstName: true, lastName: true } },
                },
            })
            : [];
        return {
            ...seller,
            createdAt: seller.createdAt.toISOString(),
            updatedAt: seller.updatedAt.toISOString(),
            totalOrders: orderItems.length,
            recentOrders: recentOrders.map((o) => ({
                id: o.id,
                orderNumber: o.orderNumber,
                totalAmount: o.totalAmount,
                status: o.status,
                customerName: `${o.user.firstName} ${o.user.lastName}`,
                createdAt: o.createdAt.toISOString(),
            })),
        };
    },
    async updateSellerStatus(id, isActive) {
        const seller = await prisma_1.prisma.user.findUnique({ where: { id } });
        if (!seller || seller.role !== "SELLER") {
            throw new Error("Seller not found.");
        }
        const updated = await prisma_1.prisma.user.update({
            where: { id },
            data: { isActive },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                isActive: true,
                shopName: true,
            },
        });
        // Send deactivation email to seller
        if (!isActive) {
            const shopName = updated.shopName || `${updated.firstName}'s Shop`;
            (0, emailService_1.sendSellerDeactivationEmail)(updated.email, `${updated.firstName} ${updated.lastName}`, shopName).catch((err) => {
                console.error("Failed to send deactivation email:", err);
            });
        }
        return updated;
    },
    async deactivateSellerAccount(id, reason) {
        const seller = await prisma_1.prisma.user.findUnique({ where: { id } });
        if (!seller || seller.role !== "SELLER") {
            throw new Error("Seller not found.");
        }
        // Deactivate the seller account
        const updated = await prisma_1.prisma.user.update({
            where: { id },
            data: {
                isActive: false,
                deactivatedReason: reason || "Deactivated by Administrator",
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                isActive: true,
                shopName: true,
                deactivatedReason: true,
            },
        });
        // Deactivate all products belonging to this seller (targeted to this specific seller only)
        await prisma_1.prisma.product.updateMany({
            where: { userId: id },
            data: { active: false },
        });
        // Send deactivation email
        const shopName = updated.shopName || `${updated.firstName}'s Shop`;
        (0, emailService_1.sendSellerDeactivationEmail)(updated.email, `${updated.firstName} ${updated.lastName}`, shopName).catch((err) => {
            console.error("Failed to send deactivation email:", err);
        });
        return updated;
    },
    async getLocations() {
        const sellers = await prisma_1.prisma.user.findMany({
            where: { role: "SELLER" },
            select: {
                location: true,
                city: true,
                state: true,
                country: true,
            },
        });
        const locations = new Set();
        sellers.forEach((s) => {
            if (s.location) {
                try {
                    const loc = JSON.parse(s.location);
                    if (loc.city)
                        locations.add(loc.city);
                    if (loc.region)
                        locations.add(loc.region);
                    if (loc.country)
                        locations.add(loc.country);
                }
                catch {
                    locations.add(s.location);
                }
            }
            // Fall back to individual address fields for sellers whose `location`
            // field was never synced.
            if (s.city)
                locations.add(s.city);
            if (s.state)
                locations.add(s.state);
            if (s.country)
                locations.add(s.country);
        });
        return Array.from(locations).sort();
    },
    /* ==========================================
       UPDATE SELLER TRUST BADGES
    ========================================== */
    async updateSellerTrustBadges(id, badges) {
        const seller = await prisma_1.prisma.user.findUnique({ where: { id } });
        if (!seller || seller.role !== "SELLER") {
            throw new Error("Seller not found.");
        }
        const allowed = ["Local Dispatch", "E-maxCertified", "Brand Official"];
        const sanitized = Array.from(new Set(badges)).filter((b) => allowed.includes(b));
        const updated = await prisma_1.prisma.user.update({
            where: { id },
            data: { trustBadges: JSON.stringify(sanitized) },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                shopName: true,
                trustBadges: true,
            },
        });
        return updated;
    },
};
