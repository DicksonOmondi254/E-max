import CustomerShell from "./CustomerShell";

// Addresses backend integration is not yet visible in the current repo snapshot.
// This screen is still fully responsive and wired to the customer dashboard shell.
const CustomerAddresses = () => {
  return (
    <CustomerShell title="Addresses">
      <div className="dashboard-card">
        <p>Address management will appear here.</p>
        <p className="muted">Use the backend API endpoints once connected.</p>
      </div>
    </CustomerShell>
  );
};

export default CustomerAddresses;

