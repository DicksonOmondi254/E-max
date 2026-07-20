import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Products from "../pages/products";
import Login from "../components/Auth/LoginForm";
import Register from "../components/Auth/RegisterForm";

import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import BrandProducts from "../pages/BrandProducts";
import CategoryProducts from "../pages/CategoryProducts";

import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/Dashboard";
import CustomerOrders from "../pages/customer/CustomerOrders";
import CustomerWishlist from "../pages/customer/CustomerWishlist";
import CustomerAddresses from "../pages/customer/CustomerAddresses";
import CustomerPaymentMethods from "../pages/customer/CustomerPaymentMethods";
import CustomerSettings from "../pages/customer/CustomerSettings";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminProducts from "../pages/admin/Products";
import AdminCategories from "../pages/admin/Categories";
import CreateCategory from "../pages/admin/CreateCategory";
import EditCategory from "../pages/admin/EditCategory";
import AdminBrands from "../pages/admin/Brands";
import EditBrand from "../pages/admin/EditBrand";
import AdminOrders from "../pages/admin/Orders";
import AdminCustomers from "../pages/admin/Customers";
import AdminReviews from "../pages/admin/Reviews";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetails />} />
        <Route path="/brands/:id" element={<BrandProducts />} />
        <Route path="/categories/:id" element={<CategoryProducts />} />
        <Route path="/cart" element={<Cart />} />
      </Route>

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer Dashboard */}
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

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="categories/new" element={<CreateCategory />} />
        <Route path="categories/edit/:id" element={<EditCategory />} />
        <Route path="brands" element={<AdminBrands />} />
        <Route path="brands/edit/:id" element={<EditBrand />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="reviews" element={<AdminReviews />} />
      </Route>
    </Routes>
  );
}





