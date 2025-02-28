import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/AddCategory.css";
import BackButton from "./BackButton";

function EditCategory() {
  // Get the category ID from the URL parameters
  const { id } = useParams();

  // Hook for navigation between pages
  const navigate = useNavigate();

  // State to store the category data
  const [category, setCategory] = useState(null);

  // State for category title
  const [title, setTitle] = useState("");

  // State for category content
  const [content, setContent] = useState("");

  // State for the current image URL
  const [image, setImage] = useState("");

  // State for the newly selected image file
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch the category details when the component loads
  useEffect(() => {
    axios
      .get(`/categories/${id}`) // Fetch category details from the server
      .then((response) => {
        const categoryData = response.data;
        setCategory(categoryData);
        setTitle(categoryData.title);
        setContent(categoryData.content);
        setImage(categoryData.image);
      })
      .catch((error) => {
        console.error("Error fetching category:", error);
        // Removed navigate("/") to prevent unwanted redirection
      });
  }, [id]);

  // Handle image selection
  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    // If a new image is selected, append it to the form data
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      // Send PUT request to update the category
      await axios.put(`/categories/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Show success message
      alert("Category updated successfully!");

      // Navigate back to the main page after updating
      navigate("/mainPage");
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Error updating the category");
    }
  };

  // Display a loading message if category data is not loaded yet
  if (!category) {
    return <div>טוען...</div>;
  }

  // Render the form for editing the category
  return (
    <div className="edit-category">
      <BackButton />
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
          {/* Display current image if no new image is selected */}
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
