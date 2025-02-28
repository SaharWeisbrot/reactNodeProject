import React, { useState } from "react";
import axios from "axios";
import "../assets/styles/AddCategory.css";
import BackButton from "./BackButton";

function AddCategory() {
  // State for category title
  const [title, setTitle] = useState("");

  // State for category content
  const [content, setContent] = useState("");

  // State for the selected image file
  const [imageFile, setImageFile] = useState(null);

  // State for success or error messages
  const [message, setMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", imageFile); // Add selected image to form data

    try {
      // Send POST request to add new category
      const response = await axios.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Get the image URL from server response
      const imageUrl = response.data.image;

      // Display success message
      setMessage("Category added successfully!");

      // If needed, update the UI by adding the new category to the list
      // setCategories([...categories, { ...response.data, image: imageUrl }]);
    } catch (error) {
      console.error("Error adding category:", error);
      setMessage("Error adding the category");
    }
  };

  // Render the form for adding a new category
  return (
    <div className="add-category">
      <form onSubmit={handleSubmit}>
        <div>
          <BackButton />
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
