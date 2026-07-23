import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// ===========================
// Lazy-loaded Pages (code-split)
// ===========================
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ProductsPage = lazy(() => import("./pages/products"));
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
const Reviews = lazy(() => import("./pages/admin/Reviews"));
const Settings = lazy(() => import("./pages/admin/Settings"));

// ===========================
// Protected Route
// ===========================
import ProtectedRoute from "./routes/ProtectedRoute";

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

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
      {/* ===========================
          Public Routes
      =========================== */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Customer Store */}
      <Route path="/products" element={<ProductsPage />} />

      <Route
        path="/products/:id"
        element={<ProductDetails />}
      />

      {/* ===========================
          Customer Routes
      =========================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/orders"
        element={
          <ProtectedRoute>
            <CustomerOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/wishlist"
        element={
          <ProtectedRoute>
            <CustomerWishlist />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/addresses"
        element={
          <ProtectedRoute>
            <CustomerAddresses />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/payment-methods"
        element={
          <ProtectedRoute>
            <CustomerPaymentMethods />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <CustomerSettings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />

      <Route
  path="/products/:slug"
  element={<ProductDetails />}
/>
<Route
  path="/cart"
  element={
    <ProtectedRoute>
      <Cart />
    </ProtectedRoute>
  }
/>

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

        {/* Reviews */}
        <Route
          path="reviews"
          element={<Reviews />}
        />

        {/* Settings */}
        <Route
          path="settings"
          element={<Settings />}
        />
      </Route>
    </Routes>
    </Suspense>
  );
}

export default App;