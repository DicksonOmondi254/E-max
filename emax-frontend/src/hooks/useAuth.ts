import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { loginStart, loginSuccess, logout, setUser } from "../redux/authSlice";
import type { User } from "../redux/authSlice";

/**
 * useAuth hook
 *
 * Provides a unified interface for auth state and actions.
 * Reads from Redux store (persisted via redux-persist).
 * No longer relies on the deprecated AuthContext.
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);

  return {
    user,
    isAuthenticated,
    loading,

    loginStart: () => dispatch(loginStart()),
    loginSuccess: (userData: User) => dispatch(loginSuccess(userData)),
    logout: () => dispatch(logout()),
    setUser: (userData: User) => dispatch(setUser(userData)),
  };
}
