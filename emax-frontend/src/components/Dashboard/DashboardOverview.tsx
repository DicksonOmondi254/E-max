const DashboardOverview = () => {
  return (
    <div className="dashboard-grid">

      <div className="dashboard-card">
        <h3>Orders</h3>
        <h1>12</h1>
      </div>

      <div className="dashboard-card">
        <h3>Wishlist</h3>
        <h1>7</h1>
      </div>

      <div className="dashboard-card">
        <h3>Coupons</h3>
        <h1>3</h1>
      </div>

      <div className="dashboard-card">
        <h3>Reward Points</h3>
        <h1>560</h1>
      </div>

    </div>
  );
};

export default DashboardOverview;