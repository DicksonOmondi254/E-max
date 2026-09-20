import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import SellerSidebar from "../components/Seller/Sidebar";
import { sellerService } from "../services/sellerService";
import "./SellerLayout.css";

// Shared styles used by all seller pages (s-* classes).
// Importing here guarantees the CSS loads even on a hard refresh of any /seller/* route
// (e.g. /seller/products, /seller/orders) without needing to visit /seller/dashboard first.
import "../pages/seller/Dashboard.css";

const SellerLayout = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [deactivated, setDeactivated] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await sellerService.checkDeactivationStatus();
        if (status.isDeactivated) {
          setDeactivated(true);
        }
      } catch (err: any) {
        // If the API returns a deactivation error, mark as deactivated
        if (err?.message?.toLowerCase().includes("deactivated")) {
          setDeactivated(true);
        }
      }
    };

    if (user?.role === "SELLER") {
      checkStatus();
    }
  }, [user]);

  return (
    <div className="seller-layout">
      {deactivated && (
        <div className="seller-deactivation-overlay">
          <div className="seller-deactivation-banner">
            <div className="deactivation-icon">⚠️</div>
            <div className="deactivation-content">
              <h3>Account Deactivated</h3>
              <p>
                Your seller account has been deactivated by the administrator. During this time, you are unable to upload products, manage listings, or provide services.
              </p>
              <p className="deactivation-contact">
                If you believe this is an error or need assistance, please contact the administrator at <strong>support@emaxmarketplace.com</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      <SellerSidebar />

      <div className="seller-content">
        <header className="seller-header">
          <div className="seller-header-left">
            <h1>Seller Dashboard</h1>
          </div>
          <div className="seller-header-right">
            <div className="seller-user-info">
              <span className="seller-user-greeting">Welcome,</span>
              <strong className="seller-user-name">
                {user?.firstName} {user?.lastName}
              </strong>
              <span className="seller-user-role">Seller</span>
            </div>
            <div className="seller-user-avatar">
              {user?.firstName?.charAt(0)?.toUpperCase() || "S"}
            </div>
          </div>
        </header>

        <main className="seller-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;

