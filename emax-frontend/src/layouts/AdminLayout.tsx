import { Outlet } from "react-router-dom";

import Sidebar from "../components/Admin/Sidebar";
import Header from "../components/Admin/Header";

import "../styles/admin.css";

const AdminLayout = () => {
  return (
    <div className="admin-layout">

      <Sidebar />

      <div className="admin-content">

        <Header />

        <main className="admin-main">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;