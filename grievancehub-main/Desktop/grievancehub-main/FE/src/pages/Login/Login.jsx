// frontend/src/pages/Login/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "@/assets/img66.png"; // Same logo import

// BADLAV YAHAN KIYA GAYA HAI: API_BASE_URL import kiya gaya hai
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // BADLAV YAHAN KIYA GAYA HAI
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage(`Login successful! Welcome, ${data.user.name}`);
        console.log(`Login successful! Welcome, ${data.user.name}`);
        navigate("/user-dashboard");
      } else {
        setMessage(data.message || "Login failed. Please try again.");
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      setMessage("Network error. Please try again later.");
      console.error("Network error during login:", error);
    }
  };

  return (
    <div className="login-page">
      {/* ✅ SAME NAVBAR AS DASHBOARD */}
      <header className="navbar">
        <div className="navbar-left">
          <a href="/" className="nav-link">
            <img src={logo} alt="GrievanceHub Logo" className="logo" />
          </a>
          <span className="brand-name">GrievanceHub</span>
        </div>

        <nav className="navbar-center">
          <a href="/" className="nav-link">Home</a>
          <a href="/login" className="nav-link">Grievance Form</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/contact" className="nav-link">Contact Us</a>
        </nav>

        <div className="navbar-right">
          <a href="/login" className="nav-btn register-btn">Login/Register</a>
          <a href="/admin-login" className="nav-btn admin-btn">Admin Login</a>
        </div>
      </header>

      <div className="login-container">
        <h2>Login to GrievanceHub</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="register-link">
          Don't have an account? <a href="/signup">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;