import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import {
  hashPassword,
  comparePassword,
} from "../utils/password";
import { generateToken, verifyToken } from "../utils/jwt";
import { sendPasswordResetEmail } from "../services/emailService";
import crypto from "crypto";

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
    } = req.body;

    const existing = await prisma.user.findFirst({
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

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
  data: {
    firstName,
    lastName,
    email,
    phone,
    password: hashed,
    role: "CUSTOMER",
  },
});

    const token = generateToken({
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
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const valid = await comparePassword(
      password,
      user.password
    );

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken({
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
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        message: "If an account with that email exists, a reset link has been sent.",
      });
    }

    // Generate random token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await hashPassword(rawToken);

    // Set expiry to 15 minutes from now
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: expiry,
      },
    });

    await sendPasswordResetEmail(email, rawToken);

    res.json({
      success: true,
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to process request. Please try again.",
    });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Find user with non-expired reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: { not: null },
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user || !user.resetToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Verify the token
    const isValid = await comparePassword(token, user.resetToken);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reset password. Please try again.",
    });
  }
};
