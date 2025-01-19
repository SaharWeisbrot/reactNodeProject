import React from "react";
import { useParams, useLocation } from "react-router-dom";
import "../assets/styles/ArticlePage.css";
import Search from "./Search";

function ArticlePage() {
  const { id } = useParams(); // קבלת ה-id מה-URL
  const location = useLocation(); // קבלת ה-state מ-Link
  const article = location.state?.post;

  // אם אין state (לדוגמה, המשתמש נכנס ישירות ל-URL)
  if (!article) {
    return <p>שגיאה{id}</p>;
  }

  return (
    <div className="article-page">
      <Search />
      <h1>{article.title}</h1>
      <img src={article.image} alt={article.title} className="article-image" />
      <p>{article.content}</p>
    </div>
  );
}

export default ArticlePage;
