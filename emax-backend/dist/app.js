"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const brandRoutes_1 = __importDefault(require("./routes/brandRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const dashboardCustomerRoutes_1 = __importDefault(require("./routes/dashboardCustomerRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const checkoutRoutes_1 = __importDefault(require("./routes/checkoutRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const wishlistRoutes_1 = __importDefault(require("./routes/wishlistRoutes"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const shippingRoutes_1 = __importDefault(require("./routes/shippingRoutes"));
const addressRoutes_1 = __importDefault(require("./routes/addressRoutes"));
const storeSettingsRoutes_1 = __importDefault(require("./routes/storeSettingsRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
/* ===========================================
   Middlewares
=========================================== */
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: {
        policy: "cross-origin",
    },
}));
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)("dev"));
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
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
/* ===========================================
   API Routes
=========================================== */
app.use("/api/auth", authRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/categories", categoryRoutes_1.default);
app.use("/api/brands", brandRoutes_1.default);
app.use("/api/upload", uploadRoutes_1.default);
app.use("/api/dashboard", dashboardRoutes_1.default);
// Customer-specific route set (keeps existing admin/global dashboard intact)
app.use("/api/dashboard/customer", dashboardCustomerRoutes_1.default);
app.use("/api/orders", orderRoutes_1.default);
app.use("/api/cart", cartRoutes_1.default);
app.use("/api/checkout", checkoutRoutes_1.default);
app.use("/api/reviews", reviewRoutes_1.default);
app.use("/api/wishlist", wishlistRoutes_1.default);
// Admin customer management
app.use("/api/admin/customers", customerRoutes_1.default);
// Shipping
app.use("/api/shipping", shippingRoutes_1.default);
// Addresses
app.use("/api/addresses", addressRoutes_1.default);
// Store Settings
app.use("/api/store-settings", storeSettingsRoutes_1.default);
// Customer Profile
app.use("/api/profile", profileRoutes_1.default);
// Notifications (admin create + user receive)
app.use("/api/notifications", notificationRoutes_1.default);
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
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});
exports.default = app;
