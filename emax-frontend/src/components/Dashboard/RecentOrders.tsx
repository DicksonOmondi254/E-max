const orders = [
  {
    id: "EMX100245",
    product: "iPhone 16 Pro",
    status: "Delivered",
    total: 185000,
  },
  {
    id: "EMX100246",
    product: "MacBook Pro M4",
    status: "Processing",
    total: 310000,
  },
];

const RecentOrders = () => {
  return (
    <div className="dashboard-card">

      <h2>Recent Orders</h2>

      {orders.map((order) => (
        <div className="order-item" key={order.id}>

          <div>

            <strong>{order.product}</strong>

            <p>{order.id}</p>

          </div>

          <div>

            <span className={`status ${order.status.toLowerCase()}`}>
              {order.status}
            </span>

            <h4>KES {order.total.toLocaleString()}</h4>

          </div>

        </div>
      ))}

    </div>
  );
};

export default RecentOrders;