import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditCategory() {
  const { id } = useParams(); // קבלת ה-ID מהנתיב
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    axios
      .get(`/categories/${id}`) // שליפת פרטי הקטגוריה מהשרת
      .then((response) => {
        const categoryData = response.data;
        setCategory(categoryData);
        setTitle(categoryData.title);
        setContent(categoryData.content);
        setImage(categoryData.image);
      })
      .catch((error) => {
        console.error("Error fetching category:", error);
        navigate("/"); // אם יש שגיאה, חזרה לדף הבית
      });
  }, [id, navigate]);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      await axios.put(`/categories/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("הקטגוריה עודכנה בהצלחה!");
      navigate("/mainPage"); // חזרה לדף הבית אחרי עדכון
    } catch (error) {
      console.error("Error updating category:", error);
      alert("שגיאה בעדכון הקטגוריה");
    }
  };

  if (!category) {
    return <div>טוען...</div>; // מציג טקסט זמני עד שהנתונים נטענים
  }

  return (
    <div className="edit-category">
      <h2>ערוך קטגוריה</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>כותרת</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>תוכן</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label>תמונה</label>
          <input type="file" onChange={handleImageChange} />
          {image && !selectedImage && (
            <img src={image} alt="current" width="100" height="100" />
          )}
        </div>
        <button type="submit">שמור שינויים</button>
      </form>
    </div>
  );
}

export default EditCategory;
