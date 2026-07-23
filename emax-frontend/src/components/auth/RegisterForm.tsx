import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebookF,
  FaApple,
} from "react-icons/fa";
import {
  MdPerson,
  MdPhone,
  MdEmail,
  MdLock,
  MdCheckCircle,
  MdError,
} from "react-icons/md";

import { authService } from "../../services/authService";

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

type FieldErrors = Partial<Record<keyof FormData, string>>;

const RegisterForm = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;

      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));

      // Clear field error on change
      if (fieldErrors[name as keyof FormData]) {
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [fieldErrors]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      const error = validateField(name as keyof FormData, value);
      if (error) {
        setFieldErrors((prev) => ({ ...prev, [name]: error }));
      } else {
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    []
  );

  const validateField = (name: keyof FormData, value: string | boolean): string => {
    switch (name) {
      case "firstName":
        return !value ? "First name is required" : "";
      case "lastName":
        return !value ? "Last name is required" : "";
      case "phone":
        if (!value) return "Phone number is required";
        if (!/^0\d{9}$/.test(value as string))
          return "Enter a valid 10-digit phone number (07XXXXXXXX)";
        return "";
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string))
          return "Enter a valid email address";
        return "";
      case "password":
        if (!value) return "Password is required";
        if ((value as string).length < 6) return "Password must be at least 6 characters";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return "";
      default:
        return "";
    }
  };

  const getPasswordStrength = (pw: string): { level: string; score: number; label: string } => {
    if (!pw) return { level: "", score: 0, label: "" };
    let score = 0;
    if (pw.length >= 6) score += 1;
    if (pw.length >= 10) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;

    if (score <= 1) return { level: "weak", score: 1, label: "Weak" };
    if (score <= 3) return { level: "medium", score: 2, label: "Medium" };
    return { level: "strong", score: 3, label: "Strong" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const isFieldValid = (name: keyof FormData): boolean => {
    if (!touched[name]) return false;
    const val = formData[name];
    if (typeof val === "boolean") return val;
    return val.length > 0 && !fieldErrors[name];
  };

  const isFieldError = (name: keyof FormData): boolean => {
    return !!touched[name] && !!fieldErrors[name];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    const errors: FieldErrors = {};
    (Object.keys(formData) as (keyof FormData)[]).forEach((key) => {
      if (key === "acceptTerms") {
        if (!formData.acceptTerms) errors[key] = "Please accept the Terms & Conditions";
      } else {
        const err = validateField(key, formData[key]);
        if (err) errors[key] = err;
      }
    });

    setFieldErrors(errors);
    setTouched({
      firstName: true,
      lastName: true,
      phone: true,
      email: true,
      password: true,
      confirmPassword: true,
      acceptTerms: true,
    });

    if (Object.keys(errors).length > 0) {
      setError("Please fix the highlighted fields below.");
      return;
    }

    try {
      setLoading(true);

      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        alert("Registration successful! Please sign in.");
        navigate("/login");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="auth-error">
          <MdError size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Social Login */}
      <div className="auth-social">
        <button type="button" className="auth-social-btn">
          <FaGoogle />
          <span>Google</span>
        </button>
        <button type="button" className="auth-social-btn">
          <FaFacebookF />
          <span>Facebook</span>
        </button>
        <button type="button" className="auth-social-btn">
          <FaApple />
          <span>Apple</span>
        </button>
      </div>

      <div className="auth-divider">or continue with email</div>

      {/* First Name & Last Name */}
      <div className="form-row">
        <div className="form-group">
          <label>First Name</label>
          <div className="input-wrapper">
            <span className="input-icon"><MdPerson size={18} /></span>
            <input
              type="text"
              name="firstName"
placeholder="Dickson"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                isFieldError("firstName") ? "input-error" : isFieldValid("firstName") ? "input-success" : ""
              }
            />
            {isFieldValid("firstName") && (
              <span className="validation-icon success"><MdCheckCircle size={16} /></span>
            )}
            {isFieldError("firstName") && (
              <span className="validation-icon error"><MdError size={16} /></span>
            )}
          </div>
          {isFieldError("firstName") && (
            <span className="field-error">{fieldErrors.firstName}</span>
          )}
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <div className="input-wrapper">
            <span className="input-icon"><MdPerson size={18} /></span>
            <input
              type="text"
              name="lastName"
              placeholder="Omondi"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                isFieldError("lastName") ? "input-error" : isFieldValid("lastName") ? "input-success" : ""
              }
            />
            {isFieldValid("lastName") && (
              <span className="validation-icon success"><MdCheckCircle size={16} /></span>
            )}
            {isFieldError("lastName") && (
              <span className="validation-icon error"><MdError size={16} /></span>
            )}
          </div>
          {isFieldError("lastName") && (
            <span className="field-error">{fieldErrors.lastName}</span>
          )}
        </div>
      </div>

      {/* Phone */}
      <div className="form-group">
        <label>Phone Number</label>
        <div className="input-wrapper">
          <span className="input-icon"><MdPhone size={18} /></span>
          <input
            type="tel"
            name="phone"
            placeholder="07XXXXXXXX"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              isFieldError("phone") ? "input-error" : isFieldValid("phone") ? "input-success" : ""
            }
          />
          {isFieldValid("phone") && (
            <span className="validation-icon success"><MdCheckCircle size={16} /></span>
          )}
          {isFieldError("phone") && (
            <span className="validation-icon error"><MdError size={16} /></span>
          )}
        </div>
        {isFieldError("phone") && (
          <span className="field-error">{fieldErrors.phone}</span>
        )}
      </div>

      {/* Email */}
      <div className="form-group">
        <label>Email Address</label>
        <div className="input-wrapper">
          <span className="input-icon"><MdEmail size={18} /></span>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              isFieldError("email") ? "input-error" : isFieldValid("email") ? "input-success" : ""
            }
          />
          {isFieldValid("email") && (
            <span className="validation-icon success"><MdCheckCircle size={16} /></span>
          )}
          {isFieldError("email") && (
            <span className="validation-icon error"><MdError size={16} /></span>
          )}
        </div>
        {isFieldError("email") && (
          <span className="field-error">{fieldErrors.email}</span>
        )}
      </div>

      {/* Password */}
      <div className="form-group">
        <label>Password</label>
        <div className="input-wrapper">
          <span className="input-icon"><MdLock size={18} /></span>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                isFieldError("password")
                  ? "input-error no-icon"
                  : isFieldValid("password")
                  ? "input-success no-icon"
                  : "no-icon"
              }
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Password Strength */}
        {formData.password && (
          <div className="password-strength">
            <div className="password-strength-bar">
              <span className={passwordStrength.score >= 1 ? `active ${passwordStrength.level}` : ""} />
              <span className={passwordStrength.score >= 2 ? `active ${passwordStrength.level}` : ""} />
              <span className={passwordStrength.score >= 3 ? `active ${passwordStrength.level}` : ""} />
            </div>
            <span className={`password-strength-text ${passwordStrength.level}`}>
              {passwordStrength.label}
            </span>
          </div>
        )}

        {isFieldError("password") && (
          <span className="field-error">{fieldErrors.password}</span>
        )}
      </div>

      {/* Confirm Password */}
      <div className="form-group">
        <label>Confirm Password</label>
        <div className="input-wrapper">
          <span className="input-icon"><MdLock size={18} /></span>
          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                isFieldError("confirmPassword")
                  ? "input-error no-icon"
                  : isFieldValid("confirmPassword")
                  ? "input-success no-icon"
                  : "no-icon"
              }
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        {isFieldError("confirmPassword") && (
          <span className="field-error">{fieldErrors.confirmPassword}</span>
        )}
      </div>

      {/* Terms */}
      <label className="checkbox">
        <input
          type="checkbox"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleChange}
        />
        <span className={`checkmark${fieldErrors.acceptTerms ? " error" : ""}`} />
        <span>
          I agree to the{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </span>
      </label>
      {fieldErrors.acceptTerms && (
        <span className="field-error">{fieldErrors.acceptTerms}</span>
      )}

      {/* Submit */}
      <button className="auth-btn" type="submit" disabled={loading}>
        {loading ? (
          <>
            <span className="auth-btn-spinner" />
            <span>Creating Account...</span>
          </>
        ) : (
          <span>Create Account</span>
        )}
      </button>

      <div className="auth-links">
        Already have an account?{" "}
        <Link to="/login">Sign In</Link>
      </div>
    </form>
  );
};

export default RegisterForm;

