import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/MainPage.css";

function MainPage() {
  // רשימה התחלתית של קטגוריות
  const initialCategories = useMemo(
    () => [
      {
        id: 1,
        title: "ראשונות",
        image:
          "https://images.pexels.com/photos/1655307/pexels-photo-1655307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        content: "כל ארוחה מוצלחת מתחילה במנה ראשונה",
      },
      {
        id: 2,
        title: "עיקריות",
        image:
          "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        content: "מוכנים למנה עיקרית?",
      },
      {
        id: 3,
        title: "קינוחים",
        image:
          "https://images.pexels.com/photos/15455310/pexels-photo-15455310/free-photo-of-photo-of-three-creamy-desserts-in-a-glasses-covered-in-chocolate-powder.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        content: "ארוחה אמיתית לא מסתיימת באמת ללא קינוח",
      },
      {
        id: 4,
        title: "שתייה",
        image:
          "https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        content: "מה עם שתייה? שלא יתייבש הגרון",
      },
    ],
    []
  );

  const [articles, setArticles] = useState([]);

  // טוען את הקטגוריות מ-localStorage אם יש
  useEffect(() => {
    const savedArticles = JSON.parse(localStorage.getItem("categories"));

    if (savedArticles && savedArticles.length > 0) {
      // משלבים את הרשימה ההתחלתית עם הקטגוריות השמורות, ומוודאים שאין כפילויות
      const mergedCategories = [...initialCategories, ...savedArticles].reduce(
        (acc, category) => {
          if (!acc.some((item) => item.id === category.id)) {
            acc.push(category);
          }
          return acc;
        },
        []
      );
      setArticles(mergedCategories);
    } else {
      setArticles(initialCategories); // אם אין קטגוריות ב-localStorage, נטען את הרשימה ההתחלתית
    }
  }, [initialCategories]);

  // פונקציה למחיקת קטגוריה
  const handleDelete = (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את הקטגוריה?")) {
      const updatedCategories = articles.filter((article) => article.id !== id);
      setArticles(updatedCategories);
      localStorage.setItem("categories", JSON.stringify(updatedCategories)); // שומר את הרשימה המעודכנת ב-localStorage
    }
  };

  return (
    <div className="main">
      <section className="articles">
        <div className="container">
          <div className="articles-container">
            {articles.map((article) => (
              <div key={article.id} className="article-card">
                <Link
                  to={`/page/${article.id}`}
                  state={{ post: article }}
                  className="article-image-container"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="article-image"
                  />
                </Link>
                <h2 className="article-title">{article.title}</h2>
                <button onClick={() => handleDelete(article.id)}>מחק</button>
              </div>
            ))}
          </div>
          <div className="edit-button-container">
            <Link to="/editPost" className="edit-button">
              <button>הוסף קטגוריה חדשה</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainPage;
