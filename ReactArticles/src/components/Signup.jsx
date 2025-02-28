import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton"; // Import the BackButton component
import "../assets/styles/Signup.css";

const Signup = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate between routes

  // State to manage form data
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_number: "",
    birthday: "",
    permission: "customer", // Default permission is set to "customer"
  });

  const [errorMessage, setErrorMessage] = useState(""); // State to store error messages
  const [showPopup, setShowPopup] = useState(false); // State to control the visibility of the success popup

  // Function to handle input changes and update the form data state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Regular expressions for validation
    const phonePattern = /^[0-9]{10}$/; // Phone number must be exactly 10 digits
    const namePattern = /^[א-ת ]{2,}$/; // Full name must contain at least 2 Hebrew letters and can include spaces
    const passwordPattern = /^(?=.*[A-Za-zא-ת])(?=.*\d)[A-Za-zא-ת\d]{1,8}$/; // Password must include letters (Hebrew/English) and numbers, up to 8 characters

    // Validate phone number
    if (!phonePattern.test(formData.phone_number)) {
      setErrorMessage("מספר טלפון חייב להיות 10 ספרות");
      return;
    }

    // Validate full name
    if (!namePattern.test(formData.full_name)) {
      setErrorMessage("שם מלא חייב לכלול לפחות 2 אותיות ויכול לכלול רווחים");
      return;
    }

    // Validate password
    if (!passwordPattern.test(formData.password)) {
      setErrorMessage(
        "הסיסמה חייבת לכלול פחות מ-8 תווים, כולל אותיות (עברית/אנגלית) ומספרים"
      );
      return;
    }

    try {
      // Send a POST request to the server to register the user
      const response = await fetch("http://localhost:8801/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // If registration is successful, show a popup and redirect to the login page after 3 seconds
      if (response.ok) {
        setShowPopup(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        // If there's an error, display the error message
        setErrorMessage(data.message || "שגיאה בהרשמה");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("שגיאה בשרת, נסה שוב מאוחר יותר.");
    }
  };

  return (
    <div className="signup-container">
      <BackButton /> {/* Render the BackButton component */}
      <h2>הרשמה</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        {/* Full Name Input */}
        <input
          type="text"
          name="full_name"
          placeholder="שם מלא"
          onChange={handleChange}
          value={formData.full_name}
          required
        />
        {/* Email Input */}
        <input
          type="email"
          name="email"
          placeholder="אימייל"
          onChange={handleChange}
          value={formData.email}
          required
        />
        {/* Password Input */}
        <input
          type="password"
          name="password"
          placeholder="סיסמה"
          onChange={handleChange}
          value={formData.password}
          required
        />
        {/* Phone Number Input */}
        <input
          type="text"
          name="phone_number"
          placeholder="טלפון"
          onChange={handleChange}
          value={formData.phone_number}
          required
        />
        {/* Birthday Input */}
        <input
          type="date"
          name="birthday"
          placeholder="תאריך לידה"
          onChange={handleChange}
          value={formData.birthday}
          required
        />
        {/* Role Selection Dropdown */}
        <select
          className="role-select"
          name="permission"
          value={formData.permission}
          onChange={handleChange}
          required
        >
          <option value="customer">לקוח</option>
          <option value="admin">מנהל</option>
        </select>
        {/* Submit Button */}
        <button type="submit">הרשמה</button>
      </form>
      {/* Display error message if there's an error */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {/* Display success popup if registration is successful */}
      {showPopup && (
        <div className="popup-message">
          <p>נרשמת בהצלחה! עכשיו מעבירים אותך לחלון התחברות...</p>
        </div>
      )}
    </div>
  );
};

export default Signup;
