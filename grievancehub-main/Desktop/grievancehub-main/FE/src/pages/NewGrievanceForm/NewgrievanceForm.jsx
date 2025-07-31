// frontend/src/pages/NewGrievanceForm/NewGrievanceForm.jsx

import React, { useState } from "react";
import "./NewGrievanceForm.css";

// BADLAV YAHAN KIYA GAYA HAI: API_BASE_URL import kiya gaya hai
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const NewGrievanceForm = () => {
  const [category, setCategory] = useState("");
  const [subFields, setSubFields] = useState({
    class: "",
    faculty: "",
    department: "",
    hostel: "",
    building: "",
    room: "",
    staff: "",
  });
  const [details, setDetails] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [message, setMessage] = useState(""); // Message display ke liye state

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please log in to submit a grievance.");
      console.error("No token found for grievance submission.");
      // TODO: Redirect to login or show login required message
      return;
    }

    const formData = new FormData();
    formData.append("title", "Grievance - " + category); // Backend expects 'title'
    formData.append("details", details); // Backend expects 'details'
    formData.append("category", category);
    formData.append("subFields", JSON.stringify(subFields)); // subFields ko JSON stringify karein

    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      // BADLAV YAHAN KIYA GAYA HAI
      const response = await fetch(`${API_BASE_URL}/api/grievances`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data' is automatically set by browser with FormData
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Grievance submitted successfully!");
        console.log("Grievance submitted:", data);
        // TODO: Replace with a custom success toast/modal
        // Form reset karein
        setCategory("");
        setSubFields({
          class: "", faculty: "", department: "", hostel: "",
          building: "", room: "", staff: "",
        });
        setDetails("");
        setAttachment(null);
      } else {
        setMessage(data.message || "Grievance submission failed.");
        console.error("Grievance submission failed:", data.message);
        // TODO: Replace with a custom error toast/modal
      }
    } catch (error) {
      setMessage("Network error. Please try again later.");
      console.error("Network error during grievance submission:", error);
      // TODO: Replace with a custom error toast/modal
    }
  };

  const renderSubCategory = () => {
    switch (category) {
      case "academic":
        return (
          <>
            <select
              value={subFields.class}
              onChange={(e) => setSubFields({ ...subFields, class: e.target.value })}
              required
            >
              <option value="">Select Course</option>
              <option value="BCA">BCA</option>
              <option value="BBA">BBA</option>
              <option value="MCA">MCA</option>
              <option value="MBA">MBA</option>
              <option value="B.tech">B.tech</option>
              <option value="M.tech">M.tech</option>
              <option value="LLB">LLB</option>
            </select>
          </>
        );

      case "administrative":
        return (
          <>
            <select
              value={subFields.department}
              onChange={(e) => setSubFields({ ...subFields, department: e.target.value })}
              required
            >
              <option value="">Select Department</option>
              <option value="Accounts">Accounts</option>
              <option value="HR">HR</option>
              <option value="Exam Cell">Exam Cell</option>
            </select>
          </>
        );

      case "infrastructure":
        return (
          <>
            <select
              value={subFields.building}
              onChange={(e) => setSubFields({ ...subFields, building: e.target.value })}
              required
            >
              <option value="">Select Building</option>
              <option value="Block A">Block A</option>
              <option value="Block B">Block B</option>
              <option value="Block C">Block C</option>
            </select>

            <select
              value={subFields.room}
              onChange={(e) => setSubFields({ ...subFields, room: e.target.value })}
              required
            >
              <option value="">Select Room</option>
              <option value="Room 101">Room 101</option>
              <option value="Room 102">Room 102</option>
              <option value="Room 103">Room 103</option>
            </select>
          </>
        );

      case "other": // 'other' category ke liye koi sub-field nahi hai
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="grievance-form-page">
      <div className="grievance-form-container">
        <h2>File a New Grievance</h2>
        <form onSubmit={handleSubmit}>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              // Category change hone par subFields reset karein
              setSubFields({
                class: "", faculty: "", department: "", hostel: "",
                building: "", room: "", staff: "",
              });
            }}
            required
          >
            <option value="">Select Category</option>
            <option value="academic">Academic</option>
            <option value="administrative">Administrative</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="other">Other</option>
          </select>

          {category && renderSubCategory()}

          {category && (
            <>
              <textarea
                placeholder="Describe your grievance..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
              />

              <label htmlFor="attachment" className="file-label">
                Attach Supporting Document
              </label>
              <input
                type="file"
                id="attachment"
                onChange={handleFileChange}
              />

              <button type="submit">Submit Grievance</button>
            </>
          )}
        </form>
        {message && <p className="message">{message}</p>} {/* Message display */}
      </div>
    </div>
  );
};

export default NewGrievanceForm;