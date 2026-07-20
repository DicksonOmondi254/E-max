"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const prisma_1 = require("../config/prisma");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, } = req.body;
        const existing = await prisma_1.prisma.user.findFirst({
            where: {
                OR: [{ email }, { phone }],
            },
        });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        const hashed = await (0, password_1.hashPassword)(password);
        const user = await prisma_1.prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                password: hashed,
                role: "CUSTOMER",
            },
        });
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        const { password: _, ...saferUser } = user;
        res.status(201).json({
            success: true,
            token,
            user: saferUser,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Registration failed",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const valid = await (0, password_1.comparePassword)(password, user.password);
        if (!valid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        const { password: _, ...safeUser } = user;
        res.json({
            success: true,
            token,
            user: safeUser,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
};
exports.login = login;
