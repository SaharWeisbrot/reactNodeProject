import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/EditPost.css";

function EditPost() {
  const navigate = useNavigate();

  // סטייט עבור קטגוריה חדשה
  const [editedPost, setEditedPost] = useState({
    id: Date.now(), // יצירת מזהה ייחודי
    title: "",
    content: "",
    image: "",
  });

  // טיפול בשינויי טופס
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // טיפול בשינוי התמונה
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedPost((prev) => ({
          ...prev,
          image: reader.result, // שמירה כ-Base64
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // טיפול בהגשה
  const handleSubmit = (e) => {
    e.preventDefault();

    // בדיקה אם כל השדות מלאים
    if (editedPost.title && editedPost.content && editedPost.image) {
      const newCategory = {
        id: Date.now(), // שימוש ב-unique ID
        title: editedPost.title,
        content: editedPost.content,
        image: editedPost.image,
      };

      // שומר את הקטגוריה ב-localStorage
      const savedArticles =
        JSON.parse(localStorage.getItem("categories")) || [];
      savedArticles.push(newCategory);
      localStorage.setItem("categories", JSON.stringify(savedArticles)); // שומר את הקטגוריות ב-localStorage

      // נווט לעמוד הראשי
      navigate("/");
    } else {
      alert("נא למלא את כל השדות.");
    }
  };

  return (
    <div className="main">
      <h2>הוסף קטגוריה חדשה</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>שם הקטגוריה:</label>
          <input
            type="text"
            name="title"
            value={editedPost.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>תיאור הקטגוריה:</label>
          <textarea
            name="content"
            value={editedPost.content}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>תמונה לקטגוריה:</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            required
          />
          {editedPost.image && (
            <img
              src={editedPost.image}
              alt="קטגוריה"
              style={{ width: "100px", marginTop: "10px" }}
            />
          )}
        </div>
        <button type="submit">הוסף</button>
      </form>
    </div>
  );
}

export default EditPost;
