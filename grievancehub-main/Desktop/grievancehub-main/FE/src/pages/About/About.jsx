import React from "react";
import "./About.css";
 import logo from "@/assets/img66.png"; // adjust path if needed

const About = () => {
  return (
    <div className="about-page">
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

      <main className="about-container">
        <h1>About GrievanceHub</h1>
        <p>
          GrievanceHub is an innovative digital platform designed to bridge the gap 
          between students, faculty, and the administration. We believe that every 
          concern deserves to be heard and resolved transparently and efficiently.
        </p>
        <p>
          Our mission is to empower institutions with a secure, user-friendly, 
          and streamlined grievance management system. Whether it’s academic, 
          administrative, infrastructure-related or any other issue, GrievanceHub 
          ensures your voice reaches the right department promptly.
        </p>
        <p>
          We provide real-time status tracking, automated updates, and a modern 
          dashboard for both students and administrators — fostering accountability 
          and trust across the institution.
        </p>
        <p>
          At GrievanceHub, we are committed to upholding the highest standards 
          of transparency, efficiency, and confidentiality. Our goal is to 
          contribute to an ecosystem where communication flows openly, 
          solutions are found faster, and every stakeholder feels valued.
        </p>
        <p>
          Join us in building a campus culture where issues don’t stay hidden 
          — they get resolved.
        </p>
      </main>

      <footer className="footer">
        © 2025 GrievanceHub | All Rights Reserved
      </footer>
    </div>
  );
};

export default About;
