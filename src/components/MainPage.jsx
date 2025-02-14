import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../assets/styles/MainPage.css";

const categoryImages = {
  ראשונות:
    "https://images.pexels.com/photos/1655307/pexels-photo-1655307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  עיקריות:
    "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  קינוחים:
    "https://images.pexels.com/photos/15455310/pexels-photo-15455310/free-photo-of-photo-of-three-creamy-desserts-in-a-glasses-covered-in-chocolate-powder.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  שתייה:
    "https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
};

function MainPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("/categories")
      .then((response) => {
        console.log(response.data);
        // const categoriesWithImages = response.data.map((category) => ({
        //   ...category,
        //   image:
        //     categoryImages[category.title] || "https://via.placeholder.com/150",
        // }));
        setCategories(response.data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את הקטגוריה?")) {
      try {
        const response = await fetch(`/categories/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("שגיאה במחיקת הקטגוריה מהשרת");
        }

        // מסנן את הקטגוריה שנמחקה מתוך הסטייט
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
            {categories.map((category) => (
              <div key={category.id} className="article-card">
                <Link
                  to={`/page/${category.id}`}
                  state={{ post: category }}
                  className="article-image-container"
                >
                  <img
                    src={category.image}
                    alt={category.title}
                    className="article-image"
                  />
                </Link>
                <h2 className="article-title">{category.title}</h2>
                <button onClick={() => handleDelete(category.id)}>מחק</button>
                <Link to={`/editCategory/${category.id}`}>
                  <button>ערוך</button>
                </Link>
              </div>
            ))}
          </div>
          <div className="edit-button-container">
            <Link to="/addCategory" className="edit-button">
              <button>הוסף קטגוריה חדשה</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainPage;
