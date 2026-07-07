import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Products from "../pages/products";
import Login from "../pages/auth/Login";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
      </Route>

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}