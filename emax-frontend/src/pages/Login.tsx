import { Link } from "react-router-dom";

import LoginForm from "../components/Auth/LoginForm";

import "../components/Auth/Auth.css";

const Login = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Section */}
        <div className="auth-left">
          <div className="auth-brand">
            <h1>E-Max</h1>

            <p>
              Genuine Electronics
              <br />
              Without the Hassle.
            </p>
          </div>

          <img
            src="/images/auth/login-banner.png"
            alt="E-Max Login"
            className="auth-image"
          />
        </div>

        {/* Right Section */}
        <div className="auth-right">
          <h2>Welcome Back</h2>

          <p className="auth-subtitle">
            Sign in to continue shopping, track your orders, manage your
            wishlist, and access your E-Max account.
          </p>

          <LoginForm />

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register">Create Account</Link>
            </p>

            <p>
              <Link to="/forgot-password">
                Forgot your password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;