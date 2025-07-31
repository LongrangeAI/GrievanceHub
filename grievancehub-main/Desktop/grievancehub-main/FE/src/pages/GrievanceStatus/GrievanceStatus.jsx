// frontend/src/pages/GrievanceStatus/GrievanceStatus.jsx

import React, { useState, useEffect } from "react";
import "./GrievanceStatus.css";

// Assuming VITE_API_BASE_URL is set in your .env file and Vercel
// For example: VITE_API_BASE_URL=https://grievancehub.onrender.com
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GrievanceStatus = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrievances = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to view your grievances.");
        setLoading(false);
        return;
      }

      try {
        // BADLAV YAHAN KIYA GAYA HAI
        const response = await fetch(`${API_BASE_URL}/api/grievances/my`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setGrievances(data);
        } else {
          setError(data.message || "Failed to fetch grievances.");
          console.error("Failed to fetch grievances:", data.message);
        }
      } catch (err) {
        setError("Network error. Could not fetch grievances.");
        console.error("Network error fetching grievances:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrievances();
  }, []);

  if (loading) {
    return (
      <div className="status-page">
        <div className="status-container">
          <h2>Your Grievances</h2>
          <p>Loading grievances...</p>
        </div>
        <p>Please ensure your VITE_API_BASE_URL environment variable is correctly set for deployment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-page">
        <div className="status-container">
          <h2>Your Grievances</h2>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="status-page">
      <div className="status-container">
        <h2>Your Grievances</h2>
        {grievances.length === 0 ? (
          <p>No grievances found.</p>
        ) : (
          <div className="status-list">
            {grievances.map((g) => (
              <div key={g.id} className="status-card">
                <h3>{g.category} Grievance (ID: {g.id.substring(0, 8)}...)</h3>
                <p><strong>Title:</strong> {g.title}</p>
                <p><strong>Details:</strong> {g.details}</p>
                <p><strong>Status:</strong> <span className={`status-${g.status.toLowerCase().replace(/\s/g, '-')}`}>{g.status}</span></p>
                <p><strong>Submitted:</strong> {new Date(g.submittedAt).toLocaleString()}</p>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GrievanceStatus;