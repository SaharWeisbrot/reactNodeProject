import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/MainPage.css";
import Search from "./Search";
function MainPage() {
  const articles = [
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
      content: "ארוחה אמיתיתי לא מסתיימת באמת ללא קינוח",
    },
    {
      id: 4,
      title: "שתייה",
      image:
        "https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      content: "מה עם שתייה? שלא יתייבש הגרון",
    },
  ];

  return (
    <div className="main">
      <section className="articles">
        <div className="container">
          <div className="articles-container">
            <Search />
            {articles &&
              articles.map((article) => (
                <div key={article.id} className="article-card">
                  {/* Link wraps the image */}
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
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainPage;
