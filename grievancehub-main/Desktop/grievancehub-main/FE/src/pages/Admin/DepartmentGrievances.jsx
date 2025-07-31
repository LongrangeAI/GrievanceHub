// frontend/src/pages/Admin/DepartmentGrievances.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DepartmentGrievances.css";

// Assuming VITE_API_BASE_URL is set in your .env file and Vercel
// For example: VITE_API_BASE_URL=https://grievancehub.onrender.com
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DepartmentGrievances = () => {
  const { deptName } = useParams();
  const navigate = useNavigate();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartmentGrievances = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setError("Admin token missing. Please log in as admin.");
        setLoading(false);
        return;
      }

      try {
        // BADLAV YAHAN KIYA GAYA HAI
        const response = await fetch(`${API_BASE_URL}/api/grievances/admin/department/${deptName}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setGrievances(data);
        } else {
          setError(data.message || "Failed to fetch department grievances.");
          console.error("Failed to fetch department grievances:", data.message);
        }
      } catch (err) {
        setError("Network error. Could not fetch department grievances.");
        console.error("Network error fetching department grievances:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentGrievances();
  }, [deptName]); // deptName change hone par re-fetch karein

  if (loading) {
    return (
      <div className="department-page">
        <header className="department-header">
          <h1>{deptName.charAt(0).toUpperCase() + deptName.slice(1)} Department Grievances</h1>
          <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
        </header>
        <p>Loading grievances...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="department-page">
        <header className="department-header">
          <h1>{deptName.charAt(0).toUpperCase() + deptName.slice(1)} Department Grievances</h1>
          <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
        </header>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="department-page">
      <header className="department-header">
        <h1>{deptName.charAt(0).toUpperCase() + deptName.slice(1)} Department Grievances</h1>
        <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
      </header>

      {grievances.length === 0 ? (
        <p className="no-grievance-text">No grievances submitted in this department.</p>
      ) : (
        grievances.map((g) => (
          <div key={g.id} className="grievance-card">
            <h3>Grievance #{g.id.substring(0, 8)}...</h3>
            <p><strong>Name:</strong> {g.name || "N/A"}</p>
            <p><strong>Email:</strong> {g.email || "N/A"}</p>
            <p><strong>Title:</strong> {g.title || "N/A"}</p>
            <p><strong>Description:</strong> {g.description}</p>
            {g.attachmentName && (
              <p>
                <strong>Attachment:</strong>{" "}
                <a
                  // BADLAV YAHAN BHI KIYA GAYA HAI
                  href={`${API_BASE_URL}/uploads/${g.attachmentName}`}
                  target="_blank"
                  rel="noreferrer"
                  className="doc-link"
                >
                  {g.attachmentName}
                </a>
              </p>
            )}
            {g.subFields && Object.keys(g.subFields).length > 0 && (
              <p>
                <strong>Sub-fields:</strong>{" "}
                {Object.entries(g.subFields)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(", ")}
              </p>
            )}
            <p><strong>Submitted:</strong> {new Date(g.submittedAt).toLocaleString()}</p>
            <p><strong>Status:</strong> <span className={`status-${g.status.toLowerCase().replace(/\s/g, '-')}`}>{g.status}</span></p>
          </div>
        ))
      )}
    </div>
  );
};

export default DepartmentGrievances;