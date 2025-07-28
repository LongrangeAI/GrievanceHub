import React from "react";
import "./Contact.css";
 import logo from "@/assets/img66.png"; // adjust path if needed

const Contact = () => {
  return (
    <div className="contact-page">
      <header className="navbar">
        <div className="navbar-left">
          <a href="/" className="nav-link">
            <img src={logo} alt="GrievanceHub Logo" className="logo" />
          </a>
          <span className="brand-name">GrievanceHub</span>
        </div>

       
        <nav className="navbar-center">
          <a href="/" className="nav-link">Home </a>
          <a href="/login" className="nav-link"> Grievance Form </a>
          <a href="/about" className="nav-link"> About </a>
          <a href="/contact" className="nav-link"> Contact Us</a>
        </nav>

        <div className="navbar-right">
          <a href="/login" className="nav-btn register-btn">Login/Register</a>
          <a href="/admin-login" className="nav-btn admin-btn">Admin Login</a>
        </div>
      </header>

      <main className="contact-container">
        <h1>Contact Us</h1>
        <p>
          We’re here to help you. If you have any questions, feedback, or concerns,
          please reach out to us through any of the channels below.
        </p>

        <div className="contact-cards">
          <div className="contact-card">
            <h3>Email Support</h3>
            <p>Reach us at:</p>
            <a href="mailto:support@grievancehub.com">support@grievancehub.com</a>
          </div>

          <div className="contact-card">
            <h3>Phone</h3>
            <p>Call us at:</p>
            <p>+91 9999987898</p>
          </div>

          <div className="contact-card">
            <h3>Visit Us</h3>
            <p>
              GrievanceHub Office,<br />
              123 University Road,<br />
              New Delhi, India
            </p>
          </div>

          <div className="contact-card">
            <h3>Working Hours</h3>
            <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
            <p>Closed on Weekends & Public Holidays</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        © 2025 GrievanceHub | All Rights Reserved
      </footer>
    </div>
  );
};

export default Contact;
