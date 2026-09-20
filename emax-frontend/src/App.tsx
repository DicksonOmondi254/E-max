import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import ErrorBoundary from "./components/common/ErrorBoundary";

// ===========================
// Lazy-loaded Pages (code-split)
// ===========================
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ProductsPage = lazy(() => import("./pages/products"));
const BrandProducts = lazy(() => import("./pages/BrandProducts"));
const BrandsPage = lazy(() => import("./pages/BrandsPage"));
const DealsPage = lazy(() => import("./pages/DealsPage"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));

// ===========================
// Customer Pages
// ===========================
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Payment = lazy(() => import("./pages/Payment"));

// ===========================
// Customer Dashboard Sub-Pages
// ===========================
const CustomerOrders = lazy(() => import("./pages/customer/CustomerOrders"));
const CustomerWishlist = lazy(() => import("./pages/customer/CustomerWishlist"));
const CustomerAddresses = lazy(() => import("./pages/customer/CustomerAddresses"));
const CustomerPaymentMethods = lazy(() => import("./pages/customer/CustomerPaymentMethods"));
const CustomerBrands = lazy(() => import("./pages/customer/CustomerBrands"));
const CustomerSettings = lazy(() => import("./pages/customer/CustomerSettings"));

// ===========================
// Admin Layout
// ===========================
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));

// ===========================
// Admin Dashboard
// ===========================
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));

// ===========================
// Admin Product Pages
// ===========================
const Products = lazy(() => import("./pages/admin/Products"));
const CreateProduct = lazy(() => import("./pages/admin/CreateProduct"));
const EditProduct = lazy(() => import("./pages/admin/EditProduct"));

// ===========================
// Admin Category Pages
// ===========================
const Categories = lazy(() => import("./pages/admin/Categories"));
const CreateCategory = lazy(() => import("./pages/admin/CreateCategory"));
const EditCategory = lazy(() => import("./pages/admin/EditCategory"));

// ===========================
// Admin Brand Pages
// ===========================
const Brands = lazy(() => import("./pages/admin/Brands"));
const CreateBrand = lazy(() => import("./pages/admin/CreateBrand"));
const EditBrand = lazy(() => import("./pages/admin/EditBrand"));

// ===========================
// Other Admin Pages
// ===========================
const Orders = lazy(() => import("./pages/admin/Orders"));
const Customers = lazy(() => import("./pages/admin/Customers"));
const Sellers = lazy(() => import("./pages/admin/Sellers"));
const Reviews = lazy(() => import("./pages/admin/Reviews"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const AdminNotifications = lazy(() => import("./pages/admin/Notifications"));
const Reports = lazy(() => import("./pages/admin/Reports"));

// ===========================
// Seller Pages
// ===========================
const SellerLayout = lazy(() => import("./layouts/SellerLayout"));
const SellerDashboard = lazy(() => import("./pages/seller/Dashboard"));
const SellerProducts = lazy(() => import("./pages/seller/Products"));
const SellerCreateProduct = lazy(() => import("./pages/seller/CreateProduct"));
const SellerEditProduct = lazy(() => import("./pages/seller/EditProduct"));
const SellerOrders = lazy(() => import("./pages/seller/Orders"));
const SellerEarnings = lazy(() => import("./pages/seller/Earnings"));
const SellerReturns = lazy(() => import("./pages/seller/Returns"));
const SellerMessages = lazy(() => import("./pages/seller/Messages"));
const SellerPromotions = lazy(() => import("./pages/seller/Promotions"));
const SellerCreateFlashSale = lazy(() => import("./pages/seller/CreateFlashSale"));
const SellerCreateAdCampaign = lazy(() => import("./pages/seller/CreateAdCampaign"));
const SellerSetDiscounts = lazy(() => import("./pages/seller/SetDiscounts"));
const SellerPerformance = lazy(() => import("./pages/seller/Performance"));
const SellerSettings = lazy(() => import("./pages/seller/Settings"));

// ===========================
// Protected Route & Layouts
// ===========================
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

// ── Loading Fallback ──
const PageLoader = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      fontSize: "1.25rem",
      color: "#6366f1",
    }}
  >
    Loading…
  </div>
);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
      <Routes>
      {/* ===========================
          Public Routes (no Navbar - clean landing)
      =========================== */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/brands" element={<BrandsPage />} />

      <Route path="/brands/:id" element={<BrandProducts />} />

      <Route path="/deals" element={<DealsPage />} />

      {/* Customer Store */}
      <Route path="/products" element={<ProductsPage />} />

      <Route
        path="/products/:id"
        element={<ProductDetails />}
      />

      <Route
        path="/products/:slug"
        element={<ProductDetails />}
      />

      {/* ===========================
          Customer Routes (with Navbar)
      =========================== */}

      <Route element={<MainLayout />}>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/orders"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <CustomerOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/wishlist"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <CustomerWishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/addresses"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <CustomerAddresses />
            </ProtectedRoute>
          }
        />

<Route
          path="/dashboard/brands"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <CustomerBrands />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/payment-methods"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <CustomerPaymentMethods />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <CustomerSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <Cart />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ===========================
          Admin Routes
      =========================== */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute
            roles={["ADMIN", "SUPER_ADMIN"]}
          >
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route
          index
          element={<AdminDashboard />}
        />

        {/* Products */}
        <Route
          path="products"
          element={<Products />}
        />

        <Route
          path="products/new"
          element={<CreateProduct />}
        />

        <Route
          path="products/edit/:id"
          element={<EditProduct />}
        />

        {/* Categories */}
        <Route
          path="categories"
          element={<Categories />}
        />

        <Route
          path="categories/new"
          element={<CreateCategory />}
        />

        <Route
          path="categories/edit/:id"
          element={<EditCategory />}
        />

        {/* Brands */}
        <Route
          path="brands"
          element={<Brands />}
        />

        <Route
          path="brands/new"
          element={<CreateBrand />}
        />

        <Route
          path="brands/edit/:id"
          element={<EditBrand />}
        />

        {/* Orders */}
        <Route
          path="orders"
          element={<Orders />}
        />

{/* Customers */}
        <Route
          path="customers"
          element={<Customers />}
        />

        {/* Sellers */}
        <Route
          path="sellers"
          element={<Sellers />}
        />

        {/* Reviews */}
        <Route
          path="reviews"
          element={<Reviews />}
        />

{/* Notifications */}
        <Route
          path="notifications"
          element={<AdminNotifications />}
        />

        {/* Reports */}
        <Route
          path="reports"
          element={<Reports />}
        />

        {/* Settings */}
        <Route
          path="settings"
          element={<Settings />}
        />
      </Route>

      {/* ===========================
          Seller Routes
      =========================== */}

      <Route
        path="/seller"
        element={
          <ProtectedRoute
            roles={["SELLER", "ADMIN", "SUPER_ADMIN"]}
          >
            <SellerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="products/new" element={<SellerCreateProduct />} />
        <Route path="products/edit/:id" element={<SellerEditProduct />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="earnings" element={<SellerEarnings />} />
        <Route path="returns" element={<SellerReturns />} />
        <Route path="messages" element={<SellerMessages />} />
        <Route path="promotions" element={<SellerPromotions />} />
        <Route path="promotions/flash-sale/new" element={<SellerCreateFlashSale />} />
        <Route path="promotions/ad-campaign/new" element={<SellerCreateAdCampaign />} />
        <Route path="promotions/bulk-discounts/new" element={<SellerSetDiscounts />} />
        <Route path="performance" element={<SellerPerformance />} />
        <Route path="settings" element={<SellerSettings />} />
      </Route>
</Routes>
    </Suspense>
    </ErrorBoundary>
  );
}

export default App;