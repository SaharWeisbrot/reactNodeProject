// src/components/BackButton.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import "../assets/styles/BackButton.css"; // Custom CSS for the button

// BackButton component to navigate to the previous page
const BackButton = () => {
  // useNavigate hook from react-router-dom for navigation
  const navigate = useNavigate();

  // Render a button that navigates one step back when clicked
  return (
    <button className="back-button" onClick={() => navigate(-1)}>
      <FaArrowRight /> חזור
    </button>
  );
};

export default BackButton;
