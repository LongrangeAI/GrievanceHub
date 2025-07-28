// frontend/src/pages/Admin/AdminUsers.jsx

import React, { useState, useEffect } from "react";
import "./AdminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(""); // Message display ke liye state

  // State for Add/Edit User Modal (simplified for now)
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // User being edited
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRole, setUserRole] = useState("user");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setError("Admin token missing. Please log in as admin.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/admin/users", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      } else {
        setError(data.message || "Failed to fetch users.");
        console.error("Failed to fetch users:", data.message);
      }
    } catch (err) {
      setError("Network error. Could not fetch users.");
      console.error("Network error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setCurrentUser(null); // Naya user add kar rahe hain
    setUserName("");
    setUserEmail("");
    setUserPassword("");
    setUserRole("user");
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user); // Existing user edit kar rahe hain
    setUserName(user.name);
    setUserEmail(user.email);
    setUserPassword(""); // Password edit karte waqt blank rakhein security ke liye
    setUserRole(user.role);
    setShowUserModal(true);
  };

  const handleDeleteUser = async (id) => {
    setMessage(""); // Clear previous messages
    // TODO: Replace with a custom confirmation modal
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("adminToken");
    if (!token) {
      setMessage("Admin token missing. Please log in as admin.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`User ${id.substring(0, 8)}... deleted successfully.`);
        console.log(`User ${id} deleted`);
        // TODO: Replace with a custom success toast/modal
        fetchUsers(); // Users list refresh karein
      } else {
        setMessage(data.message || "Failed to delete user.");
        console.error("Failed to delete user:", data.message);
        // TODO: Replace with a custom error toast/modal
      }
    } catch (error) {
      setMessage("Network error. Could not delete user.");
      console.error("Network error deleting user:", error);
      // TODO: Replace with a custom error toast/modal
    }
  };

  const handleUserModalSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setMessage("Admin token missing. Please log in as admin.");
      return;
    }

    const userData = {
      name: userName,
      email: userEmail,
      role: userRole,
    };
    if (userPassword) { // Agar password provide kiya gaya hai (naya user ya password change)
      userData.password = userPassword;
    }

    let url = "http://localhost:5000/api/users/admin/users";
    let method = "POST";

    if (currentUser) { // Edit mode
      url = `http://localhost:5000/api/users/admin/users/${currentUser.id}`;
      method = "PUT";
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        console.log(data.message, data);
        // TODO: Replace with a custom success toast/modal
        setShowUserModal(false);
        fetchUsers(); // Users list refresh karein
      } else {
        setMessage(data.message || "Operation failed.");
        console.error("User operation failed:", data.message);
        // TODO: Replace with a custom error toast/modal
      }
    } catch (error) {
      setMessage("Network error. Could not perform user operation.");
      console.error("Network error during user operation:", error);
      // TODO: Replace with a custom error toast/modal
    }
  };

  if (loading) {
    return (
      <div className="admin-users">
        <h1>Manage Users</h1>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-users">
        <h1>Manage Users</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <h1>Manage Users</h1>
      <button className="add-user-btn" onClick={handleAddUser}>+ Add User</button>

      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id.substring(0, 8)}...</td> {/* Truncate ID */}
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEditUser(u)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteUser(u.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {message && <p className="message">{message}</p>} {/* Message display */}

      {/* Simplified User Add/Edit Modal */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{currentUser ? "Edit User" : "Add New User"}</h2>
            <form onSubmit={handleUserModalSubmit}>
              <label>Name:</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <label>Email:</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
              <label>Password: {currentUser ? "(Leave blank to keep current)" : ""}</label>
              <input
                type="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required={!currentUser} // Password required for new user
              />
              <label>Role:</label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div className="modal-actions">
                <button type="submit">{currentUser ? "Save Changes" : "Add User"}</button>
                <button type="button" onClick={() => setShowUserModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
