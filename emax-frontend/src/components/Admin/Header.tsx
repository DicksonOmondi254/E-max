import { useAppSelector } from "../../redux/hooks";

const Header = () => {
  const user = useAppSelector(
    (state) => state.auth.user
  );

  return (
    <header className="admin-header">

      <h1>Dashboard</h1>

      <div className="admin-user">
        Welcome,
        <strong>
          {user?.firstName}
        </strong>
      </div>

    </header>
  );
};

export default Header;