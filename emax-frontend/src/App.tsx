import { Routes, Route } from "react-router-dom";

// ===========================
// Public Pages
// ===========================
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductsPage from "./pages/products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

// ===========================
// Customer Pages
// ===========================
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";

// ===========================
// Admin Layout
// ===========================
import AdminLayout from "./layouts/AdminLayout";

// ===========================
// Admin Dashboard
// ===========================
import AdminDashboard from "./pages/admin/Dashboard";

// ===========================
// Admin Product Pages
// ===========================
import Products from "./pages/admin/Products";
import CreateProduct from "./pages/admin/CreateProduct";
import EditProduct from "./pages/admin/EditProduct";

// ===========================
// Admin Category Pages
// ===========================
import Categories from "./pages/admin/Categories";
import CreateCategory from "./pages/admin/CreateCategory";
import EditCategory from "./pages/admin/EditCategory";

// ===========================
// Admin Brand Pages
// ===========================
import Brands from "./pages/admin/Brands";
import CreateBrand from "./pages/admin/CreateBrand";
import EditBrand from "./pages/admin/EditBrand";

// ===========================
// Other Admin Pages
// ===========================
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";

// ===========================
// Protected Route
// ===========================
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* ===========================
          Public Routes
      =========================== */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

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
      </Route>
    </Routes>
  );
}

export default App;