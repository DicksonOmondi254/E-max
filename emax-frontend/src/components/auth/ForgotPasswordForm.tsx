import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaCheckCircle, FaArrowLeft } from "react-icons/fa";

import { authService } from "../../services/authService";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await authService.forgotPassword(email.trim());
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-form">
        <div className="forgot-success">
          <div className="forgot-success-icon">
            <FaCheckCircle />
          </div>
          <h3 className="forgot-success-title">Check Your Email</h3>
          <p className="forgot-success-text">
            We've sent a password reset link to <strong>{email}</strong>. 
            Please check your inbox and follow the instructions to reset your password.
          </p>
          <p className="forgot-success-hint">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              type="button"
              className="forgot-resend-btn"
              onClick={() => setSuccess(false)}
            >
              try again
            </button>.
          </p>
          <div className="auth-links" style={{ marginTop: "24px" }}>
            <p>
              <Link to="/login">
                <FaArrowLeft style={{ marginRight: "6px", verticalAlign: "middle" }} />
                Back to Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <p className="forgot-description">
        Enter the email address associated with your account and we'll send you a link to reset your password.
      </p>

      {error && (
        <div className="auth-error">
          <span>{error}</span>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="forgot-email">Email Address</label>
        <div className="input-wrapper">
          <span className="input-icon">
            <FaEnvelope />
          </span>
          <input
            id="forgot-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            className={error ? "input-error" : ""}
            disabled={loading}
          />
        </div>
      </div>

      <button
        type="submit"
        className="auth-btn"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="auth-btn-spinner" />
            <span>Sending...</span>
          </>
        ) : (
          "Send Reset Link"
        )}
      </button>

      <div className="auth-links">
        <p>
          <Link to="/login">
            <FaArrowLeft style={{ marginRight: "6px", verticalAlign: "middle" }} />
            Back to Sign In
          </Link>
        </p>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;

