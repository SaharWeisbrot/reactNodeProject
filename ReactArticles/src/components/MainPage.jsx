import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../assets/styles/MainPage.css";

function MainPage() {
  const [categories, setCategories] = useState([]); // State to store the list of categories
  const [isAdmin, setIsAdmin] = useState(false); // State to determine if the user is an admin

  // useEffect hook to fetch categories and check if the user is an admin when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    const permission = localStorage.getItem("permission");

    if (token) {
      setIsAdmin(permission === "admin");
    }

    // Fetch categories from the server
    axios
      .get("/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Function to handle the deletion of a category
  const handleDelete = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את הקטגוריה?")) {
      try {
        const response = await fetch(`/categories/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("שגיאה במחיקת הקטגוריה מהשרת");
        }

        // Update the state to remove the deleted category
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== id)
        );

        alert("הקטגוריה נמחקה בהצלחה!");
      } catch (error) {
        console.error("שגיאה במחיקת הקטגוריה:", error);
        alert("שגיאה במחיקה");
      }
    }
  };

  return (
    <div className="main">
      <section className="articles">
        <div className="container">
          <div className="articles-container">
            {/* Map through the categories and display them */}
            {categories.map((category) => (
              <div key={category.id} className="article-card">
                <img
                  src={category.image}
                  alt={category.title}
                  className="article-image"
                />
                <h2 className="article-title">{category.title}</h2>

                {/* Direct links to the corresponding category pages */}
                {category.title === "ראשונות" && (
                  <Link to="/starters">
                    <button>הצג מנות ראשונות</button>
                  </Link>
                )}
                {category.title === "עיקריות" && (
                  <Link to="/mainDishes">
                    <button>הצג מנות עיקריות</button>
                  </Link>
                )}
                {category.title === "קינוחים" && (
                  <Link to="/desserts">
                    <button>הצג קינוחים</button>
                  </Link>
                )}
                {category.title === "שתייה" && (
                  <Link to="/drinks">
                    <button>הצג שתייה</button>
                  </Link>
                )}

                {/* Display delete and edit buttons only if the user is an admin */}
                {isAdmin && (
                  <>
                    <button onClick={() => handleDelete(category.id)}>
                      מחק
                    </button>
                    <Link to={`/editCategory/${category.id}`}>
                      <button>ערוך</button>
                    </Link>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Display the "Add New Category" button only if the user is an admin */}
          {isAdmin && (
            <div className="edit-button-container">
              <Link to="/addCategory" className="edit-button">
                <button>הוסף קטגוריה חדשה</button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default MainPage;
