// frontend/src/pages/Admin/AdminGrievanceList.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AdminGrievanceList.css";

// Assuming VITE_API_BASE_URL is set in your .env file and Vercel
// For example: VITE_API_BASE_URL=https://grievancehub.onrender.com
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminGrievanceList = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllGrievances = async () => {
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
        const response = await fetch(`${API_BASE_URL}/api/grievances/admin/all`, {
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
          console.error("Failed to fetch all grievances:", data.message);
        }
      } catch (err) {
        setError("Network error. Could not fetch grievances.");
        console.error("Network error fetching all grievances:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllGrievances();
  }, []);

  if (loading) {
    return (
      <div className="admin-grievance-list">
        <h1>All Grievances</h1>
        <p>Loading grievances...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-grievance-list">
        <h1>All Grievances</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-grievance-list">
      <h1>All Grievances</h1>
      <div className="table-wrapper">
        <table className="grievance-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Category</th>
              <th>Description</th>
              <th>Document</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {grievances.map((g) => (
              <tr key={g.id}>
                <td>{g.id.substring(0, 8)}...</td> {/* Display truncated ID */}
                <td>{g.email}</td>
                <td>{g.subject}</td>
                <td>{g.category}</td>
                <td>{g.description}</td>
                <td>
                  {g.document ? (
                    // BADLAV YAHAN BHI KIYA GAYA HAI
                    <a
                      href={`${API_BASE_URL}/uploads/${g.document}`}
                      target="_blank"
                      rel="noreferrer"
                      className="doc-link"
                    >
                      {g.document}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  <span className={`status ${g.status.toLowerCase().replace(/\s/g, '-')}`}>
                    {g.status}
                  </span>
                </td>
                <td>
                  <Link to={`/admin/grievance/${g.id}`} className="view-link">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminGrievanceList;