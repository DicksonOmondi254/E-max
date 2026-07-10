import { Outlet } from "react-router-dom";
import Sidebar from "../components/Admin/Sidebar";
import Topbar from "../components/Admin/Topbar";

const AdminLayout = () => {
  return (
    <div className="admin-layout">

      <Sidebar />

      <div className="admin-content">

        <Topbar />

        <main>

          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default AdminLayout;