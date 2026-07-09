import { useAppSelector } from "../../redux/hooks";

const DashboardHeader = () => {
  const user = useAppSelector(
    (state) => state.auth.user
  );

  return (
    <header className="dashboard-header">

      <div>

        <h1>
          Welcome {user?.firstName || "Customer"} 👋
        </h1>

        <p>
          Manage your E-Max account
        </p>

      </div>

      <img
        src="/images/avatar.png"
        alt="avatar"
        className="avatar"
      />

    </header>
  );
};

export default DashboardHeader;