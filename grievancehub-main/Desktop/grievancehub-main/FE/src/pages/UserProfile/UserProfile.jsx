// frontend/src/pages/UserProfile/UserProfile.jsx

import React, { useState, useEffect } from "react";
import "./UserProfile.css";

// BADLAV YAHAN KIYA GAYA HAI: API_BASE_URL import kiya gaya hai
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UserProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(""); // Message display ke liye state

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to view your profile.");
        setLoading(false);
        return;
      }

      try {
        // BADLAV YAHAN KIYA GAYA HAI
        const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setName(data.name);
          setEmail(data.email);
          setRole(data.role);
        } else {
          setError(data.message || "Failed to fetch user profile.");
          console.error("Failed to fetch user profile:", data.message);
        }
      } catch (err) {
        setError("Network error. Could not fetch user profile.");
        console.error("Network error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in to update your profile.");
      return;
    }

    try {
      // BADLAV YAHAN KIYA GAYA HAI
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name, role }), // Email read-only hai, isliye nahi bhej rahe
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Profile updated successfully!");
        console.log("Profile updated:", data);
        // TODO: Replace with a custom success toast/modal
        // Update localStorage user data if needed (e.g., if name changed)
        const currentUserData = JSON.parse(localStorage.getItem("user"));
        if (currentUserData) {
          localStorage.setItem("user", JSON.stringify({ ...currentUserData, name: data.user.name, role: data.user.role }));
        }
      } else {
        setMessage(data.message || "Failed to update profile.");
        console.error("Failed to update profile:", data.message);
        // TODO: Replace with a custom error toast/modal
      }
    } catch (error) {
      setMessage("Network error. Could not update profile.");
      console.error("Network error updating profile:", error);
      // TODO: Replace with a custom error toast/modal
    }
  };

  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="profile-card">
          <h2>Your Profile</h2>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-page">
        <div className="profile-card">
          <h2>Your Profile</h2>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="profile-card">
        <h2>Your Profile</h2>
        <form className="profile-form" onSubmit={handleSave}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} readOnly />

          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled // Role ko frontend se change karne ki anumati nahi hai
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit">Save Changes</button>
        </form>
        {message && <p className="message">{message}</p>} {/* Message display */}
      </div>
      <p>Please ensure your VITE_API_BASE_URL environment variable is correctly set for deployment.</p>
    </div>
  );
};

export default UserProfile;