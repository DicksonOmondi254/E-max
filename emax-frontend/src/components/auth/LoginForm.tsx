import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebookF,
  FaApple,
} from "react-icons/fa";
import {
  MdEmail,
  MdLock,
  MdError,
} from "react-icons/md";

import { authService } from "../../services/authService";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  loginStart,
  loginSuccess,
} from "../../redux/authSlice";
import { restoreCart } from "../../redux/cartSlice";

interface FormData {
  email: string;
  password: string;
}

type FieldErrors = Partial<Record<keyof FormData, string>>;

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
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
      setFieldErrors((prev) => ({ ...prev, [name]: error }));
    },
    []
  );

  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Enter a valid email address";
        return "";
      case "password":
        if (!value) return "Password is required";
        return "";
      default:
        return "";
    }
  };

  const isFieldError = (name: keyof FormData): boolean => {
    return !!touched[name] && !!fieldErrors[name];
  };

  const isFieldValid = (name: keyof FormData): boolean => {
    if (!touched[name]) return false;
    return formData[name].length > 0 && !fieldErrors[name];
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    const errors: FieldErrors = {};
    (Object.keys(formData) as (keyof FormData)[]).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) errors[key] = err;
    });

    setFieldErrors(errors);
    setTouched({ email: true, password: true });

    if (Object.keys(errors).length > 0) {
      setError("Please fix the highlighted fields below.");
      return;
    }

    try {
      dispatch(loginStart());
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      dispatch(
        loginSuccess({
          ...response.user,
          token: response.token,
        })
      );

      // Load the user's specific cart from localStorage
      dispatch(restoreCart(response.user.id));

      // Migrate any guest cart items to this user's cart
      // (guest items will be merged into user-specific key)
      const { cartService } = await import("../../services/cartService");
      cartService.migrateGuestCartToUser(response.user.id);

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
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleLogin} noValidate>
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
            autoComplete="email"
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              isFieldError("email") ? "input-error" : isFieldValid("email") ? "input-success" : ""
            }
          />
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
              placeholder="Enter your password"
              value={formData.password}
              autoComplete="current-password"
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
        {isFieldError("password") && (
          <span className="field-error">{fieldErrors.password}</span>
        )}
      </div>

      {/* Submit */}
      <button className="auth-btn" type="submit" disabled={loading}>
        {loading ? (
          <>
            <span className="auth-btn-spinner" />
            <span>Signing In...</span>
          </>
        ) : (
          <span>Sign In</span>
        )}
      </button>
    </form>
  );
};

export default LoginForm;

