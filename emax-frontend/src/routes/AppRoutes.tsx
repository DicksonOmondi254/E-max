import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Products from "../pages/products";
import Login from "../pages/auth/Login";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
      </Route>

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}