import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../assets/styles/MainPage.css";

function MainDishesPage() {
  const [mainDishes, setMainDishes] = useState([]); // State to store the list of main dishes
  const [isAdmin, setIsAdmin] = useState(false); // State to determine if the user is an admin

  // useEffect hook to fetch main dishes and check if the user is an admin when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    const permission = localStorage.getItem("permission");

    if (token) {
      setIsAdmin(permission === "admin");
    }

    // Fetch main dishes from the server
    axios
      .get("/mainDishes")
      .then((response) => {
        console.log(response.data);
        setMainDishes(response.data);
      })
      .catch((error) => console.error("Error fetching main dishes:", error));
  }, []);

  // Function to handle the deletion of a main dish
  const handleDelete = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את המנה?")) {
      try {
        const response = await fetch(`/mainDishes/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("שגיאה במחיקת המנה מהשרת");
        }

        // Update the state to remove the deleted dish
        setMainDishes((prevMainDishes) =>
          prevMainDishes.filter((mainDish) => mainDish.id !== id)
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
          {/* Buttons for additional categories */}
          <div className="category-buttons">
            <Link to="/pizzas">
              <button className="category-button">פיצות</button>
            </Link>
            <Link to="/pastas">
              <button className="category-button">פסטות</button>
            </Link>
            <Link to="/specials">
              <button className="category-button">ספיישלים</button>
            </Link>
          </div>

          {/* Container to display the main dishes */}
          <div className="articles-container">
            {mainDishes.map((mainDish) => (
              <div key={mainDish.id} className="article-card">
                <Link
                  to={`/mainDishPage/${mainDish.id}`}
                  state={{ post: mainDish }}
                  className="article-image-container"
                >
                  <img
                    src={mainDish.image_url}
                    alt={mainDish.name}
                    className="article-image"
                  />
                </Link>
                <h2 className="article-title">{mainDish.name}</h2>
                <p className="article-price">{`מחיר: ₪${mainDish.price}`}</p>
                <p className="article-description">{mainDish.description}</p>
                {/* Display delete and edit buttons only if the user is an admin */}
                {isAdmin && (
                  <>
                    <button onClick={() => handleDelete(mainDish.id)}>
                      מחק
                    </button>
                    <Link to={`/editDish/${mainDish.id}`}>
                      <button>ערוך</button>
                    </Link>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Display the "Add New Main Dish" button only if the user is an admin */}
          {isAdmin && (
            <div className="edit-button-container">
              <Link to="/addDish" className="edit-button">
                <button>הוסף מנה עיקרית חדשה</button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default MainDishesPage;
