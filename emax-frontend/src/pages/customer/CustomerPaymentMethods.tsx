import CustomerShell from "./CustomerShell";

// Payment methods backend integration is not yet visible in the current repo snapshot.
// This screen is responsive and ready for API wiring.
const CustomerPaymentMethods = () => {
  return (
    <CustomerShell title="Payment Methods">
      <div className="dashboard-card">
        <p>Payment methods will appear here.</p>
        <p className="muted">Supported methods: Card, M-Pesa, Bank Transfer, Paypal.</p>
      </div>
    </CustomerShell>
  );
};

export default CustomerPaymentMethods;

