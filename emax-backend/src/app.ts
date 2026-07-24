import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";

import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import brandRoutes from "./routes/brandRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import dashboardCustomerRoutes from "./routes/dashboardCustomerRoutes";

import orderRoutes from "./routes/orderRoutes";
import cartRoutes from "./routes/cartRoutes";
import checkoutRoutes from "./routes/checkoutRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import customerRoutes from "./routes/customerRoutes";
import shippingRoutes from "./routes/shippingRoutes";
import addressRoutes from "./routes/addressRoutes";
import storeSettingsRoutes from "./routes/storeSettingsRoutes";
import profileRoutes from "./routes/profileRoutes";
import notificationRoutes from "./routes/notificationRoutes";

dotenv.config();

const app = express();

/* ===========================================
   Middlewares
=========================================== */

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use(compression());

app.use(morgan("dev"));

/* ===========================================
   Health Check
=========================================== */

app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Welcome to the E-Max API",
    version: "1.0.0",
    status: "Running",
  });
});

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);
/* ===========================================
   API Routes
=========================================== */

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
// Customer-specific route set (keeps existing admin/global dashboard intact)
app.use("/api/dashboard/customer", dashboardCustomerRoutes);

app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Admin customer management
app.use("/api/admin/customers", customerRoutes);

// Shipping
app.use("/api/shipping", shippingRoutes);

// Addresses
app.use("/api/addresses", addressRoutes);

// Store Settings
app.use("/api/store-settings", storeSettingsRoutes);

// Customer Profile
app.use("/api/profile", profileRoutes);

// Notifications (admin create + user receive)
app.use("/api/notifications", notificationRoutes);

/*
Future Routes

app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/brands", brandRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/admin", adminRoutes);
*/

/* ===========================================
   404 Handler
=========================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.originalUrl}' not found.`,
  });
});

/* ===========================================
   Global Error Handler
=========================================== */

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);

    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
);

export default app;