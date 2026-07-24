"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileController = void 0;
const prisma_1 = require("../config/prisma");
const password_1 = require("../utils/password");
exports.profileController = {
    // ── Get Current User Profile ──
    async getProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized.",
                });
            }
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    role: true,
                    isVerified: true,
                    notifications: true,
                    language: true,
                    currency: true,
                    timezone: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found.",
                });
            }
            return res.status(200).json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            console.error("Get profile error:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch profile.",
            });
        }
    },
    // ── Update Profile ──
    async updateProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized.",
                });
            }
            const { firstName, lastName, email, phone, notifications, language, currency, timezone } = req.body;
            // Build update data with only provided fields
            const updateData = {};
            if (firstName !== undefined)
                updateData.firstName = firstName;
            if (lastName !== undefined)
                updateData.lastName = lastName;
            if (email !== undefined) {
                // Check email uniqueness
                const existingEmail = await prisma_1.prisma.user.findFirst({
                    where: { email, id: { not: userId } },
                });
                if (existingEmail) {
                    return res.status(400).json({
                        success: false,
                        message: "Email is already in use.",
                    });
                }
                updateData.email = email;
            }
            if (phone !== undefined) {
                // Check phone uniqueness
                const existingPhone = await prisma_1.prisma.user.findFirst({
                    where: { phone, id: { not: userId } },
                });
                if (existingPhone) {
                    return res.status(400).json({
                        success: false,
                        message: "Phone number is already in use.",
                    });
                }
                updateData.phone = phone;
            }
            if (notifications !== undefined)
                updateData.notifications = notifications;
            if (language !== undefined)
                updateData.language = language;
            if (currency !== undefined)
                updateData.currency = currency;
            if (timezone !== undefined)
                updateData.timezone = timezone;
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No fields to update.",
                });
            }
            const updatedUser = await prisma_1.prisma.user.update({
                where: { id: userId },
                data: updateData,
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
                },
            });
            return res.status(200).json({
                success: true,
                message: "Profile updated successfully.",
                data: updatedUser,
            });
        }
        catch (error) {
            console.error("Update profile error:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to update profile.",
            });
        }
    },
    // ── Change Password ──
    async changePassword(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized.",
                });
            }
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Current password and new password are required.",
                });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "New password must be at least 6 characters.",
                });
            }
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found.",
                });
            }
            const isValid = await (0, password_1.comparePassword)(currentPassword, user.password);
            if (!isValid) {
                return res.status(400).json({
                    success: false,
                    message: "Current password is incorrect.",
                });
            }
            const hashedNewPassword = await (0, password_1.hashPassword)(newPassword);
            await prisma_1.prisma.user.update({
                where: { id: userId },
                data: { password: hashedNewPassword },
            });
            return res.status(200).json({
                success: true,
                message: "Password changed successfully.",
            });
        }
        catch (error) {
            console.error("Change password error:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to change password.",
            });
        }
    },
};
