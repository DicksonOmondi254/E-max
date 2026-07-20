import { Link } from "react-router-dom";

const QuickActions = () => {
  return (
    <div className="dashboard-card">
      <h2>Quick Actions</h2>
      <div className="quick-actions">
        <Link to="/products" className="action-btn">
          Continue Shopping
        </Link>

        <Link to="/dashboard/orders" className="action-btn">
          View Orders
        </Link>

        <Link to="/dashboard/wishlist" className="action-btn">
          Wishlist
        </Link>

        <Link to="/profile" className="action-btn">
          My Profile
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
