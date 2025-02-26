// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, RegisterData } from "../api/auth";
import authorImg from "../assets/author-img.png"; // Ensure this matches the testimonial background
import mycaLogo from "../assets/myca_logo.svg"; // Add a logo file if available
import "./RegisterPage.css";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [robotChecked, setRobotChecked] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (!robotChecked) {
      setError("Please verify you're not a robot");
      setIsLoading(false);
      return;
    }

    try {
      const data = await registerUser({
        fullName,
        email,
        password,
        confirmPassword,
      } as RegisterData);
      localStorage.setItem("token", data.token);
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
    <div
    className="testimonial-section"
    style={{
        backgroundImage: `url(${authorImg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
    }}
    >
        <div className="testimonial-content">
          <h2>Welcome to the future you.</h2>
          <div className="testimonial-quote">
            <p>
              “Myca has everything a busy professional needs and has quickly become my go-to daily productivity tool.”
            </p>
            <div className="testimonial-author">
              <img
                src="https://via.placeholder.com/60"
                alt="Ray Hale"
                className="author-image"
              />
              <div>
                <strong>Ray Hale</strong>
                <p>Chief Financial Officer, Niesum</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="register-form-section">
        <div className="register-form-wrapper">
          <img src={mycaLogo} alt="Myca Logo" className="myca-logo" /> {/* Add logo */}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="robotCheck"
                checked={robotChecked}
                onChange={() => setRobotChecked(!robotChecked)}
                disabled={isLoading}
              />
              <label htmlFor="robotCheck">I'm not a robot</label>
            </div>
            <button
              type="submit"
              className="primary-button"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign up with email"}
            </button>
          </form>
          <div className="social-register">
            <button className="apple-button">Sign up with Apple</button>
            <button className="google-button">Sign up with Google</button>
          </div>
          <div className="login-redirect">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
