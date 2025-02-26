
// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import loginImage from "../assets/login-img.png"; // Ensure this matches the scenic image
import mycaLogo from "../assets/myca_logo.svg"; // Ensure this path is correct
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("AUTH_TOKEN", data.token);
      navigate("/plan");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-image-section">
        <img src={loginImage} alt="Scenic" className="login-image" />
      </div>
      <div className="login-form-section">
        <div className="login-form-wrapper">
          {/* Add fallback text if the logo fails to load */}
          {mycaLogo ? (
            <img src={mycaLogo} alt="Myca Logo" className="myca-logo" />
          ) : (
            <h1 className="myca-text">myca</h1> // Fallback text
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="forgot-password">
              <Link to="#">Forgot Password?</Link>
            </div>
            <button type="submit" className="primary-button">
              Sign In
            </button>
          </form>
          <div className="social-login">
            <button className="apple-button">Sign in with Apple</button>
            <button className="google-button">Sign in with Google</button>
          </div>
          <div className="register-redirect">
            Don't have an account? <Link to="/register">Register now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;