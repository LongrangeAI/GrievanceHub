// frontend/src/pages/UserSettings/UserSettings.jsx

import React, { useState } from "react";
import "./UserSettings.css";

const UserSettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notifications, setNotifications] = useState(true); // Frontend state, backend mein abhi handle nahi ho raha
  const [twoFactorAuth, setTwoFactorAuth] = useState(false); // Frontend state, backend mein abhi handle nahi ho raha
  const [newsletter, setNewsletter] = useState(true); // Frontend state, backend mein abhi handle nahi ho raha
  const [message, setMessage] = useState(""); // Message display ke liye state

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in to update your settings.");
      return;
    }

    // Sirf password change functionality backend mein implement ki gayi hai
    const settingsData = {};
    if (currentPassword && newPassword) {
      settingsData.currentPassword = currentPassword;
      settingsData.newPassword = newPassword;
    } else if (currentPassword || newPassword) {
      setMessage("Both current and new password are required to change password.");
      return;
    }

    // Agar aap notifications, twoFactorAuth, newsletter ko bhi backend mein save karna chahte hain,
    // to backend mein unke liye fields add karein aur yahan settingsData mein shamil karein.
    // settingsData.notifications = notifications;
    // settingsData.twoFactorAuth = twoFactorAuth;
    // settingsData.newsletter = newsletter;

    try {
      const response = await fetch("http://localhost:5000/api/users/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(settingsData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Settings saved successfully!");
        console.log("Settings saved:", data);
        // TODO: Replace with a custom success toast/modal
        // Password fields clear karein after successful update
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setMessage(data.message || "Failed to save settings.");
        console.error("Failed to save settings:", data.message);
        // TODO: Replace with a custom error toast/modal
      }
    } catch (error) {
      setMessage("Network error. Could not save settings.");
      console.error("Network error saving settings:", error);
      // TODO: Replace with a custom error toast/modal
    }
  };

  return (
    <div className="user-settings-page">
      <div className="settings-card">
        <h2>Account Settings</h2>
        <form className="settings-form" onSubmit={handleSave}>
          <label>Current Password</label>
          <input
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required={newPassword !== ""} // Required if new password is being set
          />

          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <div className="toggle-group">
            <label>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                disabled // Abhi backend mein handle nahi ho raha
              />
              Enable Email Notifications (Currently not functional)
            </label>
          </div>

          <div className="toggle-group">
            <label>
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                disabled // Abhi backend mein handle nahi ho raha
              />
              Enable Two-Factor Authentication (Currently not functional)
            </label>
          </div>

         

          <button type="submit">Save Settings</button>
        </form>
        {message && <p className="message">{message}</p>} {/* Message display */}
      </div>
    </div>
  );
};

export default UserSettings;
