import { Routes, Route } from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Customer Pages
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";

// Admin Layout
import AdminLayout from "./layouts/AdminLayout";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import CreateProduct from "./pages/admin/CreateProduct";
import EditProduct from "./pages/admin/EditProduct";
import Categories from "./pages/admin/Categories";
import Brands from "./pages/admin/Brands";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";

// Protected Route
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
        <Route index element={<AdminDashboard />} />

        <Route path="products" element={<Products />} />

        <Route path="products/new" element={<CreateProduct />} />

        <Route path="products/edit/:id" element={<EditProduct />} />

        <Route path="categories" element={<Categories />} />

        <Route path="brands" element={<Brands />} />

        <Route path="orders" element={<Orders />} />

        <Route path="customers" element={<Customers />} />
      </Route>
    </Routes>
  );
}

export default App;