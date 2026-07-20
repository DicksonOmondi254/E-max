import CustomerShell from "./CustomerShell";

// Settings backend integration is not yet visible in the current repo snapshot.
const CustomerSettings = () => {
  return (
    <CustomerShell title="Settings">
      <div className="dashboard-card">
        <p>Account settings will appear here.</p>
      </div>
    </CustomerShell>
  );
};

export default CustomerSettings;

