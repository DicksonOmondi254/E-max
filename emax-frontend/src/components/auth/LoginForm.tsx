import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { authService } from "../../services/authService";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import {
  loginStart,
  loginSuccess,
} from "../../redux/authSlice";

const LoginForm = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { loading } = useAppSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      dispatch(loginStart());

      const response = await authService.login({
        email,
        password,
      });

      dispatch(
        loginSuccess({
          ...response.user,
          token: response.token,
        })
      );

      switch (response.user.role) {
        case "ADMIN":
        case "SUPER_ADMIN":
          navigate("/admin");
          break;

        case "SELLER":
          navigate("/seller");
          break;

        default:
          navigate("/dashboard");
      }
    } catch (err: any) {
      console.error(err);

      setError(err.message || "Login failed.");
    }
  };

  return (
    <form
      className="auth-card"
      onSubmit={handleLogin}
    >
      <h2>Welcome Back</h2>

      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        autoComplete="email"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        autoComplete="current-password"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button
        type="submit"
        className="auth-btn"
        disabled={loading}
      >
        {loading ? "Signing In..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;