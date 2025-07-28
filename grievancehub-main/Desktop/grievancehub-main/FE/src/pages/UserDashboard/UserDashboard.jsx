    // frontend/src/pages/UserDashboard/UserDashboard.jsx

    import React from "react";
    import { Link, useNavigate } from "react-router-dom";
    import "./UserDashboard.css";
    // Image path updated to use alias
    import logo from "@/assets/img66.png"; // Using alias for src/assets/img66.png

    const UserDashboard = () => {
      const navigate = useNavigate();

      const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        console.log("Logged out!");
        navigate("/login");
      };

      return (
        <div className="user-dashboard">
          <header className="user-navbar">
            <div className="navbar-left">
              <a href="/" className="nav-link">
                <img src={logo} alt="GrievanceHub Logo" className="logo" />
              </a>
              <span className="user-brand-name">GrievanceHub</span>
            </div>

            <nav className="navbar-center">
              <a href="/" className="nav-link">Home</a>
              <a href="/grievance-form" className="nav-link">Grievance Form</a>
              <a href="/grievance-status" className="nav-link">Grievance Status</a>
            </nav>

            <div className="navbar-right">
              <Link to="/profile" className="nav-btn">Profile</Link>
              <Link to="/settings" className="nav-btn">Settings</Link>

              <button className="nav-btn logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </header>

          <main className="user-main">
            <h1><strong>Welcome to GrievanceHub</strong></h1>
            <p>A secure and transparent platform for submitting and tracking grievances.</p>
            <Link to="/grievance-form" className="hero-btn">Submit a New Grievance</Link>
          </main>
<footer className="footer">
            © 2025 GrievanceHub - Grievance Redressal System | All Rights Reserved
          </footer>

        </div>
      );
    };

    export default UserDashboard;
    