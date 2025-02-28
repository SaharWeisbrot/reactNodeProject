import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/Login.css"; // Importing CSS for styling

// Login component
const Login = () => {
  // State variables for email, password, and messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Collecting user credentials
    const userCredentials = { email, password };

    try {
      // Sending login request to the backend
      const response = await fetch("http://localhost:8801/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userCredentials),
      });

      // If login is successful
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token); // Storing token
        localStorage.setItem("permission", data.permission); // Storing user permission

        // Displaying success message
        setSuccessMessage("ההתחברות בוצעה בהצלחה!");
        setErrorMessage(""); // Clearing error message

        // Redirect to main page after 2 seconds
        setTimeout(() => {
          navigate("/mainPage");
        }, 2000);
      } else {
        // If login failed, display error message
        const errorData = await response.json();
        setErrorMessage(errorData.message || "אימייל או סיסמא לא נכונים");
        setSuccessMessage(""); // Clearing success message
      }
    } catch (error) {
      console.error("Error:", error);
      // Displaying generic error message for network or server issues
      setErrorMessage("משהו השתבש. אנא נסה שוב מאוחר יותר.");
      setSuccessMessage(""); // Clearing success message
    }
  };

  return (
    <div className="login-container">
      <h2>ברוך הבא! להתחברות-</h2>

      {/* Displaying success message */}
      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
      )}

      {/* Displaying error message */}
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Login form */}
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          name="email"
          placeholder="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="סיסמא"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />
        <button type="submit" className="login-button">
          התחבר
        </button>
      </form>

      {/* Signup button */}
      <p>עדיין אין לך חשבון?</p>
      <Link to="/signup">
        <button className="signup-button">להרשמה</button>
      </Link>
    </div>
  );
};

export default Login;
