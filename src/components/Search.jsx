import React, { useState } from "react";
import "../assets/styles/Search.css";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Searching for:", searchTerm); // כאן תוכל להוסיף פונקציה לחיפוש
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="חפש מרכיב ספציפי למשל: עוף..."
          value={searchTerm}
          onChange={handleInputChange}
          className="search-input"
        />
        <button type="submit" className="search-button">
          חפש
        </button>
      </form>
    </div>
  );
}

export default Search;
