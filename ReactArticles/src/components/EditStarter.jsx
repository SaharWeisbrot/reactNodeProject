import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/AddCategory.css"; // Using the same CSS file
import BackButton from "./BackButton"; // Reusing the BackButton component
function EditStarters() {
  // Get the starter ID from the URL parameters
  const { id } = useParams();

  // Hook for navigation between pages
  const navigate = useNavigate();

  // State to store the starter data
  const [starter, setStarter] = useState(null);

  // State for starter name
  const [name, setName] = useState("");

  // State for starter description
  const [description, setDescription] = useState("");

  // State for starter price
  const [price, setPrice] = useState("");

  // State for the current image URL
  const [image, setImage] = useState("");

  // State for the newly selected image file
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch the starter details when the component loads
  useEffect(() => {
    axios
      .get(`/starters/${id}`) // Fetch starter details from the server
      .then((response) => {
        const starterData = response.data;
        setStarter(starterData);
        setName(starterData.name);
        setDescription(starterData.description);
        setPrice(starterData.price);
        setImage(starterData.image);
      })
      .catch((error) => {
        console.error("Error fetching starter:", error);
        // Optional: Handle navigation in case of error
      });
  }, [id]);

  // Handle image selection
  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]); // Update the new selected image
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);

    // If a new image is selected, append it to the form data
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      // Send PUT request to update the starter
      await axios.put(`/starters/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Show success message
      alert("Starter updated successfully!");

      // Navigate back to the starters page after updating
      navigate("/starters");
    } catch (error) {
      console.error("Error updating starter:", error);
      alert("Error updating the starter");
    }
  };

  // Display a loading message if starter data is not loaded yet
  if (!starter) {
    return <div>טוען...</div>;
  }

  // Render the form for editing the starter
  return (
    <div className="edit-category">
      <BackButton />
      <h2>ערוך מנה ראשונה</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>שם המנה</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>תיאור המנה</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label>מחיר</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
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

export default EditStarters;
