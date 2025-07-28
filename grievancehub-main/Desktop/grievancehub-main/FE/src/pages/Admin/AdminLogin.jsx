// frontend/src/pages/Admin/AdminLogin.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [username, setUsername] = useState(""); // Email will be used as username for admin
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState(""); // Message display ke liye state

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      const response = await fetch("http://localhost:5000/api/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // Backend expects 'username' for email
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminToken", data.token); // Admin token save karein
        localStorage.setItem("adminUser", JSON.stringify(data.user)); // Admin user data save karein
        setMessage("Admin login successful. Redirecting to dashboard...");
        console.log("Admin login successful:", data);
        // TODO: Replace with a custom success toast/modal
        navigate("/admin");
      } else {
        setMessage(data.message || "Admin login failed. Please try again.");
        console.error("Admin login failed:", data.message);
        // TODO: Replace with a custom error toast/modal
      }
    } catch (error) {
      setMessage("Network error. Please try again later.");
      console.error("Network error during admin login:", error);
      // TODO: Replace with a custom error toast/modal
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleAdminLogin}>
          <input
            type="text"
            placeholder="Admin Email" /* Changed to Email as backend expects email for username */
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login as Admin</button>
        </form>
        {message && <p className="message">{message}</p>} {/* Message display */}
      </div>
    </div>
  );
};

export default AdminLogin;
