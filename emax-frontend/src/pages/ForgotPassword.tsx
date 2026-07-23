import { Link } from "react-router-dom";
import { FaShieldAlt, FaTruck, FaUndo } from "react-icons/fa";

import ForgotPasswordForm from "../components/Auth/ForgotPasswordForm";
import { useStoreSettings } from "../hooks/useStoreSettings";

import "../components/Auth/Auth.css";

const ForgotPassword = () => {
  const { logo, storeName } = useStoreSettings();

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Section - Brand */}
        <div className="auth-left">
          {/* Decorative shapes */}
          <div className="auth-shapes">
            <div className="auth-shape" />
            <div className="auth-shape" />
            <div className="auth-shape" />
            <div className="auth-shape" />
          </div>

          <div className="auth-brand">
            {logo ? (
              <img
                src={logo}
                alt={`${storeName} logo`}
                className="auth-logo"
              />
            ) : (
              <h1>{storeName}</h1>
            )}

            <p>
              Genuine Electronics & Accessories Without the Hassle.
            </p>
          </div>

          {/* Trust badges */}
          <div className="auth-trust-badges">
            <div className="auth-trust-item">
              <span className="auth-trust-icon">
                <FaShieldAlt />
              </span>
              <span className="auth-trust-text">
                <strong>100% Authentic</strong> Products Guaranteed
              </span>
            </div>
            <div className="auth-trust-item">
              <span className="auth-trust-icon">
                <FaTruck />
              </span>
              <span className="auth-trust-text">
                <strong>Free Delivery</strong> on orders over KSh 5,000
              </span>
            </div>
            <div className="auth-trust-item">
              <span className="auth-trust-icon">
                <FaUndo />
              </span>
              <span className="auth-trust-text">
                <strong>14-Day Returns</strong> No questions asked
              </span>
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="auth-right">
          <h2>Forgot Password?</h2>

          <p className="auth-subtitle">
            No worries, we'll send you a reset link to get back into your account.
          </p>

          <ForgotPasswordForm />

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

