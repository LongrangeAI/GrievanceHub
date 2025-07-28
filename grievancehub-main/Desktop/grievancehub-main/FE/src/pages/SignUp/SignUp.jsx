// frontend/src/pages/SignUp/SignUp.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import logo from "@/assets/img66.png"; // Use your logo

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful! Please login.");
        console.log("Registration successful:", data);
        navigate("/login");
      } else {
        setMessage(data.message || "Registration failed. Please try again.");
        console.error("Registration failed:", data.message);
      }
    } catch (error) {
      setMessage("Network error. Please try again later.");
      console.error("Network error during registration:", error);
    }
  };

  return (
    <div className="signup-page">
      {/* ✅ Same navbar as Login page */}
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

      <div className="signup-container">
        <h2>Register for GrievanceHub</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Create a Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Register</button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
