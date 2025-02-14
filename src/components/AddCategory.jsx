import React, { useState } from "react";
import axios from "axios";

function AddCategory() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", imageFile); // התמונה שנבחרה

    try {
      const response = await axios.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // קבלת כתובת התמונה מהשרת
      const imageUrl = response.data.image; // ה-URL של התמונה מהשרת

      // הצגת הודעת הצלחה
      setMessage("הקטגוריה נוספה בהצלחה!");

      // אם תרצה לעדכן את הממשק, תוכל להוסיף את הקטגוריה המתקבלת לרשימה
      // setCategories([...categories, { ...response.data, image: imageUrl }]);
    } catch (error) {
      console.error("שגיאה בהוספת קטגוריה:", error);
      setMessage("שגיאה בהוספת הקטגוריה");
    }
  };

  return (
    <div className="add-category">
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
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
          />
        </div>

        <button type="submit">הוסף קטגוריה</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddCategory;
