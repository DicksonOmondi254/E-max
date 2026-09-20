import { useState, useEffect, useCallback } from "react";
import {
  FaChartBar,
  FaDollarSign,
  FaBoxes,
  FaUsers,
  FaTrophy,
  FaDownload,
  FaShoppingBag,
  FaMoneyBillWave,
  FaBoxOpen,
  FaStar,
  FaExclamationTriangle,
  FaCheckCircle,
  FaBan,
  FaHourglassHalf,
  FaShippingFast,
} from "react-icons/fa";
import { reportService } from "../../services/reportService";
import type {
  SalesSummary,
  OrderEntry,
  FinanceSummary,
  TransactionEntry,
  TaxInfo,
  InventorySummary,
  ProductEntry,
  CustomerSummary,
  ReviewEntry,
  PerformanceSummary,
} from "../../services/reportService";

type TabId = "sales" | "finance" | "inventory" | "customers" | "performance";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "sales", label: "Sales", icon: <FaChartBar /> },
  { id: "finance", label: "Finance", icon: <FaDollarSign /> },
  { id: "inventory", label: "Inventory", icon: <FaBoxes /> },
  { id: "customers", label: "Customers", icon: <FaUsers /> },
  { id: "performance", label: "Performance", icon: <FaTrophy /> },
];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount: number) =>
  `KES ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const csvEscape = (val: unknown): string => {
if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const downloadCSV = (filename: string, headers: string[], rows: unknown[][]) => {
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map(csvEscape).join(",")),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const Reports = () => {
  const [activeTab, setActiveTab] = useState<TabId>("sales");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sales
  const [salesData, setSalesData] = useState<{ summary: SalesSummary; orders: OrderEntry[] } | null>(null);

  // Finance
  const [financeData, setFinanceData] = useState<{ summary: FinanceSummary; transactions: TransactionEntry[]; taxInfo: TaxInfo } | null>(null);

  // Inventory
  const [inventoryData, setInventoryData] = useState<{ summary: InventorySummary; products: ProductEntry[] } | null>(null);

  // Customers
  const [customerData, setCustomerData] = useState<{ summary: CustomerSummary; reviews: ReviewEntry[] } | null>(null);

  // Performance
  const [performanceData, setPerformanceData] = useState<{ summary: PerformanceSummary } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = dateFrom || dateTo ? { dateFrom: dateFrom || undefined, dateTo: dateTo || undefined } : undefined;
      switch (activeTab) {
        case "sales": {
          const data = await reportService.getSalesReport(params);
          setSalesData(data);
          break;
        }
        case "finance": {
          const data = await reportService.getFinanceReport(params);
          setFinanceData(data);
          break;
        }
        case "inventory": {
          const data = await reportService.getInventoryReport();
          setInventoryData(data);
          break;
        }
        case "customers": {
          const data = await reportService.getCustomerReport(params);
          setCustomerData(data);
          break;
        }
        case "performance": {
          const data = await reportService.getPerformanceReport(params);
          setPerformanceData(data);
          break;
        }
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load report.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, dateFrom, dateTo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExportCSV = () => {
    if (activeTab === "sales" && salesData) {
      downloadCSV(
        "sales-report.csv",
        ["Order #", "Customer", "Email", "Total", "Status", "Payment", "Date"],
        salesData.orders.map((o) => [o.orderNumber, o.customerName, o.customerEmail, o.totalAmount, o.status, o.paymentStatus, formatDate(o.createdAt)])
      );
    } else if (activeTab === "finance" && financeData) {
      downloadCSV(
        "finance-report.csv",
        ["Order #", "Customer", "Email", "Amount", "Payment Status", "Date"],
        financeData.transactions.map((t) => [t.orderNumber, t.customerName, t.customerEmail, t.amount, t.paymentStatus, formatDate(t.date)])
      );
    } else if (activeTab === "inventory" && inventoryData) {
      downloadCSV(
        "inventory-report.csv",
        ["Product", "Category", "Brand", "Price", "Stock", "Featured", "Active"],
        inventoryData.products.map((p) => [p.name, p.category, p.brand, p.price, p.stock, p.featured ? "Yes" : "No", p.active ? "Yes" : "No"])
      );
    } else if (activeTab === "customers" && customerData) {
      downloadCSV(
        "customer-report.csv",
        ["Customer", "Email", "Product", "Rating", "Comment", "Date"],
        customerData.reviews.map((r) => [r.customerName, r.customerEmail, r.productName, r.rating, r.comment, formatDate(r.date)])
      );
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          style={{ color: i <= rating ? "#f59e0b" : "#d1d5db", fontSize: 12 }}
        />
      );
    }
    return <span style={{ display: "inline-flex", gap: 1, alignItems: "center" }}>{stars}</span>;
  };

  const renderSummaryCard = (icon: React.ReactNode, label: string, value: string | number, color: string) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: "#fff",
        borderRadius: 12,
        padding: "18px 20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        border: "1px solid #f3f4f6",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
          background: color,
          color: "#fff",
        }}
      >
        {icon}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
          {value}
        </span>
        <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{label}</span>
      </div>
    </div>
  );

  return (
    <div className="admin-page" style={{ width: "100%" }}>
      {/* Page Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div className="page-header-left">
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: 10 }}>
            <FaChartBar style={{ color: "#6b7280", fontSize: 22 }} />
            Reports
          </h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
            {loading ? "Loading report data..." : "View and export business reports."}
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            style={{
              padding: "8px 12px",
              fontSize: 13,
              border: "1.5px solid #d1d5db",
              borderRadius: 8,
              outline: "none",
              background: "#fff",
              color: "#374151",
            }}
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            style={{
              padding: "8px 12px",
              fontSize: 13,
              border: "1.5px solid #d1d5db",
              borderRadius: 8,
              outline: "none",
              background: "#fff",
              color: "#374151",
            }}
          />
          <button
            onClick={handleExportCSV}
            disabled={loading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              border: "1.5px solid #d1d5db",
              borderRadius: 8,
              background: "#fff",
              color: "#374151",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 24,
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: 0,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #2563eb" : "2px solid transparent",
              background: "transparent",
              color: activeTab === tab.id ? "#2563eb" : "#6b7280",
              cursor: "pointer",
              marginBottom: -2,
              transition: "color 0.15s",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: 10,
            marginBottom: 24,
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            fontSize: 14,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
          }}
        >
          <span>⚠️</span>
          <span>{error}</span>
          <button
            onClick={fetchData}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "1px solid #fecaca",
              color: "#991b1b",
              padding: "4px 12px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
          <p style={{ fontSize: 14 }}>Loading report data...</p>
        </div>
      )}

      {/* Sales Report */}
      {!loading && activeTab === "sales" && salesData && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {renderSummaryCard(<FaShoppingBag />, "Total Orders", salesData.summary.totalOrders, "#2563eb")}
            {renderSummaryCard(<FaHourglassHalf />, "Pending", salesData.summary.pendingOrders, "#d97706")}
            {renderSummaryCard(<FaBoxOpen />, "Processing", salesData.summary.processingOrders, "#2563eb")}
            {renderSummaryCard(<FaShippingFast />, "Shipped", salesData.summary.shippedOrders, "#7c3aed")}
            {renderSummaryCard(<FaCheckCircle />, "Delivered", salesData.summary.deliveredOrders, "#059669")}
            {renderSummaryCard(<FaBan />, "Cancelled", salesData.summary.cancelledOrders, "#dc2626")}
            {renderSummaryCard(<FaMoneyBillWave />, "Revenue", formatCurrency(salesData.summary.totalRevenue), "#16a34a")}
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", fontWeight: 600, fontSize: 15, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
              <FaShoppingBag style={{ color: "#6b7280", fontSize: 14 }} />
              Recent Orders
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                <thead>
                  <tr>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Order #</th>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Customer</th>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Total</th>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Status</th>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Payment</th>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "60px 20px", textAlign: "center" }}>
                        <div style={{ textAlign: "center" }}>
                          <FaShoppingBag style={{ fontSize: 48, color: "#d1d5db", marginBottom: 16 }} />
                          <h3 style={{ fontSize: 18, color: "#374151", margin: "0 0 8px 0" }}>No orders found</h3>
                          <p style={{ fontSize: 14, color: "#9ca3af", margin: 0 }}>No orders match the selected filters.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    salesData.orders.map((order) => (
                      <tr key={order.id} style={{ transition: "background 0.15s" }}>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6", fontWeight: 600, fontSize: 13, color: "#2563eb" }}>{order.orderNumber}</td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6" }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{order.customerName}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>{order.customerEmail}</div>
                        </td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6", fontWeight: 700, fontSize: 14, color: "#111827" }}>{formatCurrency(order.totalAmount)}</td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "#f3f4f6", color: "#374151" }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "#f3f4f6", color: "#374151" }}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6", fontSize: 13, color: "#6b7280" }}>{formatDate(order.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Finance Report */}
      {!loading && activeTab === "finance" && financeData && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {renderSummaryCard(<FaMoneyBillWave />, "Paid Orders", financeData.summary.paidOrders, "#059669")}
            {renderSummaryCard(<FaBan />, "Refunded Orders", financeData.summary.refundedOrders, "#dc2626")}
            {renderSummaryCard(<FaDollarSign />, "Total Payout", formatCurrency(financeData.summary.totalPayout), "#2563eb")}
            {renderSummaryCard(<FaDollarSign />, "Taxable Amount", formatCurrency(financeData.taxInfo.taxableAmount), "#d97706")}
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: 24 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", fontWeight: 600, fontSize: 15, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
              <FaDollarSign style={{ color: "#6b7280", fontSize: 14 }} />
              Transactions
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                <thead>
                  <tr>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Order #</th>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Customer</th>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Amount</th>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Status</th>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {financeData.transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: "60px 20px", textAlign: "center" }}>
                        <div style={{ textAlign: "center" }}>
                          <FaDollarSign style={{ fontSize: 48, color: "#d1d5db", marginBottom: 16 }} />
                          <h3 style={{ fontSize: 18, color: "#374151", margin: "0 0 8px 0" }}>No transactions found</h3>
                          <p style={{ fontSize: 14, color: "#9ca3af", margin: 0 }}>No transactions match the selected filters.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    financeData.transactions.map((tx) => (
                      <tr key={tx.id} style={{ transition: "background 0.15s" }}>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6", fontWeight: 600, fontSize: 13, color: "#2563eb" }}>{tx.orderNumber}</td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6" }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{tx.customerName}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>{tx.customerEmail}</div>
                        </td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6", fontWeight: 700, fontSize: 14, color: "#111827" }}>{formatCurrency(tx.amount)}</td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "#f3f4f6", color: "#374151" }}>
                            {tx.paymentStatus}
                          </span>
                        </td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6", fontSize: 13, color: "#6b7280" }}>{formatDate(tx.date)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tax Info Card */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px 24px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
              <FaDollarSign style={{ color: "#6b7280", fontSize: 14 }} />
              Tax Information
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#374151" }}>
                <span style={{ color: "#9ca3af" }}>Tax Rate:</span>
                <span style={{ fontWeight: 600 }}>{financeData.taxInfo.taxRate}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#374151" }}>
                <span style={{ color: "#9ca3af" }}>Taxable Amount:</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(financeData.taxInfo.taxableAmount)}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#374151" }}>
                <span style={{ color: "#9ca3af" }}>Estimated Tax:</span>
                <span style={{ fontWeight: 600 }}>{financeData.taxInfo.estimatedTax}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Report */}
      {!loading && activeTab === "inventory" && inventoryData && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {renderSummaryCard(<FaBoxes />, "Total Products", inventoryData.summary.totalProducts, "#2563eb")}
            {renderSummaryCard(<FaBoxOpen />, "Total Stock", inventoryData.summary.totalStock, "#059669")}
            {renderSummaryCard(<FaExclamationTriangle />, "Low Stock", inventoryData.summary.lowStock, "#d97706")}
            {renderSummaryCard(<FaBan />, "Out of Stock", inventoryData.summary.outOfStock, "#dc2626")}
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", fontWeight: 600, fontSize: 15, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
              <FaBoxes style={{ color: "#6b7280", fontSize: 14 }} />
              Products
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                <thead>
                  <tr>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Product</th>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Category</th>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Brand</th>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "right" }}>Price</th>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "right" }}>Stock</th>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "center" }}>Featured</th>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "center" }}>Active</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData.products.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: "60px 20px", textAlign: "center" }}>
                        <div style={{ textAlign: "center" }}>
                          <FaBoxes style={{ fontSize: 48, color: "#d1d5db", marginBottom: 16 }} />
                          <h3 style={{ fontSize: 18, color: "#374151", margin: "0 0 8px 0" }}>No products found</h3>
                          <p style={{ fontSize: 14, color: "#9ca3af", margin: 0 }}>No products in inventory.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    inventoryData.products.map((product) => (
                      <tr key={product.id} style={{ transition: "background 0.15s" }}>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6" }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{product.name}</div>
                        </td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6", fontSize: 13, color: "#374151" }}>{product.category}</td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6", fontSize: 13, color: "#374151" }}>{product.brand}</td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6", fontWeight: 700, fontSize: 14, color: "#111827", textAlign: "right" }}>{formatCurrency(product.price)}</td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6", textAlign: "right" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              padding: "4px 10px",
                              borderRadius: 20,
                              fontSize: 12,
                              fontWeight: 600,
                              background: product.stock === 0 ? "#fef2f2" : product.stock < 10 ? "#fefce8" : "#ecfdf5",
                              color: product.stock === 0 ? "#991b1b" : product.stock < 10 ? "#92400e" : "#065f46",
                            }}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6", textAlign: "center" }}>
                          <span style={{ color: product.featured ? "#059669" : "#d1d5db", fontSize: 14 }}>
                            {product.featured ? "✓" : "—"}
                          </span>
                        </td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6", textAlign: "center" }}>
                          <span style={{ color: product.active ? "#059669" : "#dc2626", fontSize: 14 }}>
                            {product.active ? "✓" : "✕"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Customer Report */}
      {!loading && activeTab === "customers" && customerData && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {renderSummaryCard(<FaBan />, "Cancelled Orders", customerData.summary.cancelledOrders, "#dc2626")}
            {renderSummaryCard(<FaBan />, "Refunded Orders", customerData.summary.refundedOrders, "#d97706")}
            {renderSummaryCard(<FaStar />, "Total Reviews", customerData.summary.totalReviews, "#f59e0b")}
            {renderSummaryCard(<FaStar />, "Avg Rating", customerData.summary.averageRating, "#059669")}
          </div>

          {/* Rating Distribution */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px 24px", marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
              <FaStar style={{ color: "#d97706" }} />
              Rating Distribution
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = customerData.summary.ratingDistribution[star] || 0;
                const total = Object.values(customerData.summary.ratingDistribution).reduce((a, b) => a + b, 0);
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={star} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "#374151", minWidth: 40 }}>
                      {star} <FaStar style={{ color: "#f59e0b", fontSize: 11 }} />
                    </span>
                    <div style={{ flex: 1, height: 10, background: "#f3f4f6", borderRadius: 5, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #f59e0b, #d97706)", borderRadius: 5, transition: "width 0.5s ease" }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", minWidth: 30, textAlign: "right" }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews Table */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", fontWeight: 600, fontSize: 15, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
              <FaStar style={{ color: "#6b7280", fontSize: 14 }} />
              Reviews
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                <thead>
                  <tr>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Customer</th>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Product</th>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Rating</th>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Comment</th>
                    <th style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {customerData.reviews.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: "60px 20px", textAlign: "center" }}>
                        <div style={{ textAlign: "center" }}>
                          <FaStar style={{ fontSize: 48, color: "#d1d5db", marginBottom: 16 }} />
                          <h3 style={{ fontSize: 18, color: "#374151", margin: "0 0 8px 0" }}>No reviews found</h3>
                          <p style={{ fontSize: 14, color: "#9ca3af", margin: 0 }}>No reviews match the selected filters.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    customerData.reviews.map((review) => (
                      <tr key={review.id} style={{ transition: "background 0.15s" }}>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6" }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{review.customerName}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>{review.customerEmail}</div>
                        </td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6", fontSize: 13, color: "#2563eb", fontWeight: 600 }}>{review.productName}</td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6" }}>{renderStars(review.rating)}</td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6", fontSize: 13, color: "#374151", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{review.comment}</td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f3f4f6", fontSize: 13, color: "#6b7280" }}>{formatDate(review.date)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Performance Report */}
      {!loading && activeTab === "performance" && performanceData && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {renderSummaryCard(<FaShoppingBag />, "Total Orders", performanceData.summary.totalOrders, "#2563eb")}
            {renderSummaryCard(<FaCheckCircle />, "Delivered", performanceData.summary.deliveredOrders, "#059669")}
            {renderSummaryCard(<FaBan />, "Cancelled", performanceData.summary.cancelledOrders, "#dc2626")}
            {renderSummaryCard(<FaStar />, "Avg Rating", performanceData.summary.averageRating, "#f59e0b")}
            {renderSummaryCard(<FaTrophy />, "Delivery Rate", performanceData.summary.deliveryRate, "#16a34a")}
            {renderSummaryCard(<FaExclamationTriangle />, "Cancellation Rate", performanceData.summary.cancellationRate, "#dc2626")}
          </div>

          {/* Scorecard */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px 24px", marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
              <FaTrophy style={{ color: "#d97706" }} />
              Seller Scorecard
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <div style={{ background: "#f9fafb", borderRadius: 10, padding: "16px", border: "1px solid #f3f4f6" }}>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Delivery Performance</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{performanceData.summary.scorecard.deliveryPerformance}</div>
              </div>
              <div style={{ background: "#f9fafb", borderRadius: 10, padding: "16px", border: "1px solid #f3f4f6" }}>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Customer Satisfaction</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{performanceData.summary.scorecard.customerSatisfaction}</div>
              </div>
              <div style={{ background: "#f9fafb", borderRadius: 10, padding: "16px", border: "1px solid #f3f4f6" }}>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Order Fulfillment</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{performanceData.summary.scorecard.orderFulfillment}</div>
              </div>
            </div>
          </div>

          {/* Penalties */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px 24px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
              <FaExclamationTriangle style={{ color: "#dc2626" }} />
              Penalties & Charges
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <div style={{ background: "#fef2f2", borderRadius: 10, padding: "16px", border: "1px solid #fecaca" }}>
                <div style={{ fontSize: 12, color: "#991b1b", marginBottom: 4 }}>Cancelled %</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#991b1b" }}>{performanceData.summary.penalties.cancelledPercentage}</div>
              </div>
              <div style={{ background: "#fef2f2", borderRadius: 10, padding: "16px", border: "1px solid #fecaca" }}>
                <div style={{ fontSize: 12, color: "#991b1b", marginBottom: 4 }}>Cancelled Amount</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#991b1b" }}>{formatCurrency(performanceData.summary.penalties.cancelledAmount)}</div>
              </div>
              <div style={{ background: "#fef2f2", borderRadius: 10, padding: "16px", border: "1px solid #fecaca" }}>
                <div style={{ fontSize: 12, color: "#991b1b", marginBottom: 4 }}>Estimated Penalty</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#991b1b" }}>{formatCurrency(performanceData.summary.penalties.estimatedPenalty)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
