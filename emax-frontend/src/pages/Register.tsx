import { Link } from "react-router-dom";

import RegisterForm from "../pages/Auth/RegisterForm";

import "../components/Auth/Auth.css";

const Register = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-brand">
            <h1>E-Max</h1>

            <p>
              Genuine Electronics &
              <br />
              Accessories Without the Hassle.
            </p>
          </div>

          <img
            src="/images/auth/register-banner.png"
            alt="E-Max Register"
            className="auth-image"
          />
        </div>

        <div className="auth-right">
          <h2>Create Your Account</h2>

          <p className="auth-subtitle">
            Join thousands of customers shopping genuine electronics at the best
            prices.
          </p>

          <RegisterForm />

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login">
                Sign In
              </Link>
            </p>

            <small>
              By creating an account you agree to the Terms &
              Conditions and Privacy Policy.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;