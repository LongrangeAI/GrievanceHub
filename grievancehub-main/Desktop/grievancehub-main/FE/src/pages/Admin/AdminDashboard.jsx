// frontend/src/pages/Admin/AdminDashboard.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import logo from "@/assets/img66.png";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  const departments = ["academic", "administrative", "infrastructure", "other"];

  return (
    <div className="admin-dashboard">
      <header className="admin-navbar">
        <div className="admin-navbar-left">
          <a href="/" className="nav-link">
                          <img src={logo} alt="GrievanceHub Logo" className="logo" />
                        </a>
          <span className="admin-brand-name">GrievanceHub Admin</span>
        </div>
        <div className="admin-navbar-right">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="content-wrapper">
        <main className="admin-main">
          <h1>Welcome, Admin</h1>
          <p>Use the options below to manage the platform:</p>

          <div className="admin-actions">
            <Link to="/admin/grievances" className="admin-card">
              <h3>View All Grievances</h3>
              <p>Check, filter, and update grievance statuses.</p>
            </Link>

            <Link to="/admin/users" className="admin-card">
              <h3>Manage Users</h3>
              <p>View, add or remove student/staff accounts.</p>
            </Link>

            <Link to="/admin/reports" className="admin-card">
              <h3>Reports & Analytics</h3>
              <p>Generate and download grievance reports.</p>
            </Link>
          </div>

          <hr className="divider" />

          <h2>Departments</h2>
          <p>View grievances by department:</p>

          <div className="admin-actions">
            {departments.map((dept) => (
              <Link
                key={dept}
                to={`/admin/department/${dept}`}
                className="admin-card"
              >
                <h3>{dept.charAt(0).toUpperCase() + dept.slice(1)} Department</h3>
                <p>View all grievances submitted under this category.</p>
              </Link>
            ))}
          </div>
        </main>

        
      </div>
    </div>
  );
};

export default AdminDashboard;
