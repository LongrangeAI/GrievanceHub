// frontend/src/pages/Admin/AdminGrievanceDetail.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./AdminGrievanceDetail.css";

const AdminGrievanceDetail = () => {
  const { id } = useParams();
  const [grievance, setGrievance] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(""); // Message display ke liye state

  useEffect(() => {
    const fetchGrievanceDetail = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setError("Admin token missing. Please log in as admin.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/grievances/admin/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setGrievance(data);
          setStatus(data.status); // Set initial status from fetched data
        } else {
          setError(data.message || "Failed to fetch grievance details.");
          console.error("Failed to fetch grievance details:", data.message);
        }
      } catch (err) {
        setError("Network error. Could not fetch grievance details.");
        console.error("Network error fetching grievance details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrievanceDetail();
  }, [id]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setMessage("Admin token missing. Please log in as admin.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/grievances/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Status updated to: ${status}`);
        console.log(`Status updated to: ${status}`);
        // TODO: Replace with a custom success toast/modal
        // Optionally, re-fetch grievance details to ensure UI is up-to-date
        // fetchGrievanceDetail();
      } else {
        setMessage(data.message || "Failed to update status.");
        console.error("Failed to update status:", data.message);
        // TODO: Replace with a custom error toast/modal
      }
    } catch (error) {
      setMessage("Network error. Could not update status.");
      console.error("Network error updating status:", error);
      // TODO: Replace with a custom error toast/modal
    }
  };

  if (loading) {
    return (
      <div className="admin-grievance-detail">
        <h1>Grievance Details</h1>
        <p>Loading grievance details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-grievance-detail">
        <h1>Grievance Details</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!grievance) {
    return (
      <div className="admin-grievance-detail">
        <h1>Grievance Details</h1>
        <p>Grievance not found.</p>
      </div>
    );
  }

  return (
    <div className="admin-grievance-detail">
      <h1>Grievance Details</h1>
      <div className="detail-card">
        <p><strong>Grievance ID:</strong> {grievance.id.substring(0, 8)}...</p>
        <p><strong>Submitted By:</strong> {grievance.name} ({grievance.email})</p>
        <p><strong>Subject:</strong> {grievance.subject}</p>
        <p><strong>Category:</strong> {grievance.category}</p>
        {grievance.subFields && Object.keys(grievance.subFields).length > 0 && (
          <p>
            <strong>Sub-fields:</strong>{" "}
            {Object.entries(grievance.subFields)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")}
          </p>
        )}
        <p><strong>Description:</strong></p>
        <p className="description">{grievance.description}</p>
        <p>
          <strong>Document:</strong>{" "}
          {grievance.document ? (
            <a
              href={`http://localhost:5000/uploads/${grievance.document}`}
              target="_blank"
              rel="noreferrer"
              className="doc-link"
            >
              {grievance.document}
            </a>
          ) : (
            "No attachment"
          )}
        </p>
        <p><strong>Submitted At:</strong> {new Date(grievance.submittedAt).toLocaleString()}</p>
        <form onSubmit={handleStatusUpdate} className="status-form">
          <label htmlFor="status-select">Update Status:</label>
          <select
            id="status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option> {/* Added Rejected status */}
          </select>
          <button type="submit">Update Status</button>
        </form>
        {message && <p className="message">{message}</p>} {/* Message display */}
      </div>
    </div>
  );
};

export default AdminGrievanceDetail;
