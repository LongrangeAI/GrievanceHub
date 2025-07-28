// frontend/src/pages/Admin/AdminReports.jsx

import React, { useState, useEffect } from "react";
import "./AdminReports.css";

const AdminReports = () => {
  const [summary, setSummary] = useState({
    totalGrievances: 0,
    pending: 0,
    resolved: 0,
    inProgress: 0,
    rejected: 0, // Added rejected status
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(""); // Message display ke liye state

  useEffect(() => {
    const fetchReportSummary = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setError("Admin token missing. Please log in as admin.");
        setLoading(false);
        return;
      }

      try {
        // Backend se saari grievances fetch karein aur frontend par summary calculate karein
        const response = await fetch("http://localhost:5000/api/grievances/admin/all", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          const total = data.length;
          const pending = data.filter(g => g.status === "Pending").length;
          const resolved = data.filter(g => g.status === "Resolved").length;
          const inProgress = data.filter(g => g.status === "In Progress").length;
          const rejected = data.filter(g => g.status === "Rejected").length; // Calculate rejected

          setSummary({
            totalGrievances: total,
            pending,
            resolved,
            inProgress,
            rejected,
          });
        } else {
          setError(data.message || "Failed to fetch report data.");
          console.error("Failed to fetch report data:", data.message);
        }
      } catch (err) {
        setError("Network error. Could not fetch report data.");
        console.error("Network error fetching report data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportSummary();
  }, []);

  const handleDownload = () => {
    setMessage("Downloading report... (This feature needs backend implementation)");
    console.log("Downloading report... (hook this to backend export)");
    // TODO: Backend mein ek endpoint banayein jo reports generate aur download kare.
    // Example: window.open('http://localhost:5000/api/admin/reports/download?token=' + token);
  };

  if (loading) {
    return (
      <div className="admin-reports">
        <h1>Reports & Analytics</h1>
        <p>Loading report data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-reports">
        <h1>Reports & Analytics</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-reports">
      <h1>Reports & Analytics</h1>
      <p>Analyze grievance trends and download reports for record-keeping.</p>

      <div className="report-summary">
        <div className="report-card">
          <h3>Total Grievances</h3>
          <p>{summary.totalGrievances}</p>
        </div>
        <div className="report-card">
          <h3>Pending</h3>
          <p>{summary.pending}</p>
        </div>
        <div className="report-card">
          <h3>Resolved</h3>
          <p>{summary.resolved}</p>
        </div>
        <div className="report-card">
          <h3>In Progress</h3>
          <p>{summary.inProgress}</p>
        </div>
        <div className="report-card">
          <h3>Rejected</h3>
          <p>{summary.rejected}</p>
        </div>
      </div>

      <button className="download-btn" onClick={handleDownload}>
        Download Full Report
      </button>
      {message && <p className="message">{message}</p>} {/* Message display */}
    </div>
  );
};

export default AdminReports;
