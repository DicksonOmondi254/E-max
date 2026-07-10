import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { authService } from "../../services/authService";

import { useAppDispatch } from "../../redux/hooks";

import {
  loginStart,
  loginSuccess,
} from "../../redux/authSlice";
const LoginForm = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");

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
          navigate("/dashboard");
          break;

        default:
          navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Login failed.");
    }
  };

  return (
    <div className="auth-card">
      <h2>Welcome Back</h2>

      {error && (
        <p
          style={{
            color: "red",
            marginBottom: "10px",
          }}
        >
          {error}
        </p>
      )}

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default LoginForm;