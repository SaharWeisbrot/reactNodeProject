import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../assets/styles/MainPage.css"; // Import the CSS file for styling
import BackButton from "../components/BackButton"; // Import the BackButton component

function StartersPage() {
  const [starters, setStarters] = useState([]); // State to store the list of starters
  const [isAdmin, setIsAdmin] = useState(false); // State to determine if the user is an admin

  // useEffect hook to fetch starters and check if the user is an admin when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    const permission = localStorage.getItem("permission"); // Get the permission from localStorage

    if (token) {
      // If the user is logged in, check if they are an admin
      setIsAdmin(permission === "admin"); // Set isAdmin to true if the permission is "admin"
    }

    // Fetch starters from the server
    axios
      .get("/starters") // API endpoint to fetch starters
      .then((response) => {
        console.log(response.data);
        setStarters(response.data); // Update the state with the fetched starters
      })
      .catch((error) => console.error("Error fetching starters:", error));
  }, []);

  // Function to handle the deletion of a starter
  const handleDelete = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את המנה?")) {
      try {
        const response = await fetch(`/starters/${id}`, {
          method: "DELETE", // Send a DELETE request to the server
        });

        if (!response.ok) {
          throw new Error("שגיאה במחיקת המנה מהשרת");
        }

        // Update the state to remove the deleted starter
        setStarters((prevStarters) =>
          prevStarters.filter((starter) => starter.id !== id)
        );

        alert("המנה נמחקה בהצלחה!");
      } catch (error) {
        console.error("שגיאה במחיקת המנה:", error);
        alert("שגיאה במחיקה");
      }
    }
  };

  return (
    <div className="main">
      <section className="articles">
        <div className="container">
          <div className="articles-container">
            <BackButton /> {/* Render the BackButton component */}
            {/* Map through the starters and display them */}
            {starters.map((starter) => (
              <div key={starter.id} className="article-card">
                <Link
                  to={`/startersPage/${starter.id}`} // Link to the starter's detail page
                  state={{ post: starter }} // Pass the starter data to the linked page
                  className="article-image-container"
                >
                  <img
                    src={starter.image_url} // Display the starter's image
                    alt={starter.name}
                    className="article-image"
                  />
                </Link>
                <h2 className="article-title">{starter.name}</h2>{" "}
                {/* Display the starter's name */}
                <p className="article-price">{`מחיר: ₪${starter.price}`}</p>{" "}
                {/* Display the starter's price */}
                <p className="article-description">
                  {starter.description}
                </p>{" "}
                {/* Display the starter's description */}
                {/* Display delete and edit buttons only if the user is an admin */}
                {isAdmin && (
                  <>
                    <button onClick={() => handleDelete(starter.id)}>
                      מחק
                    </button>
                    <Link to={`/editStarter/${starter.id}`}>
                      <button>ערוך</button>
                    </Link>
                  </>
                )}
              </div>
            ))}
          </div>
          {/* Display the "Add New Starter" button only if the user is an admin */}
          {isAdmin && (
            <div className="edit-button-container">
              <Link to="/addStarter" className="edit-button">
                <button>הוסף מנה ראשונה חדשה</button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default StartersPage;
