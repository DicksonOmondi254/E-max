"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeSettingsService = void 0;
const prisma_1 = require("../config/prisma");
const DEFAULT_SETTINGS = {
    storeName: "E-Max Store",
    tagline: "Your Premium Shopping Destination",
    supportEmail: "support@emaxstore.com",
    supportPhone: "+254 700 123 456",
    address: "123 Kenyatta Avenue, Nairobi, Kenya",
    currency: "KES",
    timezone: "Africa/Nairobi",
    logo: "",
    primaryColor: "#6366f1",
    secondaryColor: "#8b5cf6",
    accentColor: "#f59e0b",
    backgroundColor: "#f5f6fa",
    darkMode: false,
    paymentMethods: JSON.stringify([
        { id: "mpesa", name: "M-Pesa", description: "Mobile money via Safaricom", enabled: true, type: "mpesa" },
        { id: "card", name: "Credit / Debit Card", description: "Visa, Mastercard, etc.", enabled: true, type: "card" },
        { id: "paypal", name: "PayPal", description: "Global PayPal payments", enabled: false, type: "paypal" },
        { id: "bank", name: "Bank Transfer", description: "Direct bank deposit", enabled: true, type: "bank" },
    ]),
    notifications: JSON.stringify([
        { id: "new-orders", label: "New Orders", description: "Alert when a new order is placed", enabled: true },
        { id: "new-customers", label: "New Customers", description: "Alert when a new customer registers", enabled: true },
        { id: "low-stock", label: "Low Stock Alerts", description: "Alert when stock is low", enabled: true },
        { id: "new-reviews", label: "New Reviews", description: "Alert when a review is submitted", enabled: false },
        { id: "cancellations", label: "Order Cancellations", description: "Alert when order is cancelled", enabled: true },
        { id: "payment-failures", label: "Payment Failures", description: "Alert when a payment fails", enabled: true },
    ]),
    metaTitle: "E-Max Store - Premium Shopping",
    metaDescription: "Discover the best deals on electronics, fashion, home goods at E-Max Store.",
    googleAnalyticsId: "",
    maintenanceMode: false,
};
exports.storeSettingsService = {
    // ── Get Store Settings (singleton - always returns the first/only row) ──
    async getSettings() {
        let settings = await prisma_1.prisma.storeSettings.findFirst();
        if (!settings) {
            settings = await prisma_1.prisma.storeSettings.create({
                data: DEFAULT_SETTINGS,
            });
        }
        return settings;
    },
    // ── Update Store Settings ──
    async updateSettings(data) {
        let settings = await prisma_1.prisma.storeSettings.findFirst();
        if (!settings) {
            settings = await prisma_1.prisma.storeSettings.create({
                data: { ...DEFAULT_SETTINGS, ...data },
            });
        }
        else {
            settings = await prisma_1.prisma.storeSettings.update({
                where: { id: settings.id },
                data,
            });
        }
        return settings;
    },
};
