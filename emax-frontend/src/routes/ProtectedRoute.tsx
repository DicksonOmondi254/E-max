import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({
  children,
  roles,
}: ProtectedRouteProps) => {
  const location = useLocation();

  const { isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  // User must be logged in
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Check role authorization
  if (
    roles &&
    roles.length > 0 &&
    !roles.includes(user.role.toUpperCase())
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;