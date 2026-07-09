import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { authService } from "../../services/authService";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.acceptTerms) {
      setError("Please accept the Terms & Conditions.");
      return;
    }

    try {
      setLoading(true);

      await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      });

      alert("Registration successful!");

      navigate("/login");
    } catch (err) {
      console.error(err);

      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="auth-form"
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label>First Name</label>

          <input
            type="text"
            name="firstName"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>

          <input
            type="text"
            name="lastName"
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Phone Number</label>

        <input
          type="tel"
          name="phone"
          placeholder="07XXXXXXXX"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Email Address</label>

        <input
          type="email"
          name="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Password</label>

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
          />

          <button
            type="button"
            className="toggle-password"
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>Confirm Password</label>

        <div className="password-field">
          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button
            type="button"
            className="toggle-password"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
          >
            {showConfirmPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </button>
        </div>
      </div>

      <label className="checkbox">
        <input
          type="checkbox"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleChange}
        />

        I agree to the Terms & Conditions and Privacy Policy.
      </label>

      <button
        className="auth-btn"
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Creating Account..."
          : "Create Account"}
      </button>

      <div className="auth-links">
        Already have an account?{" "}
        <Link to="/login">
          Sign In
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm; 