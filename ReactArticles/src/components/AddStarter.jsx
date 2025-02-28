import React, { useState } from "react";
import axios from "axios";
import "../assets/styles/AddCategory.css";
import BackButton from "./BackButton";

function AddStarter() {
  // State for starter name
  const [name, setName] = useState("");

  // State for starter description
  const [description, setDescription] = useState("");

  // State for starter price
  const [price, setPrice] = useState("");

  // State for the selected image file
  const [imageFile, setImageFile] = useState(null);

  // State for success or error messages
  const [message, setMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", imageFile); // Add selected image to form data

    try {
      // Send POST request to add new starter
      const response = await axios.post("/starters", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Get the image URL from server response
      const imageUrl = response.data.image;

      // Display success message
      setMessage("Starter added successfully!");

      // If needed, update the UI by adding the new starter to the list
      // setStarters([...starters, { ...response.data, image: imageUrl }]);
    } catch (error) {
      console.error("Error adding starter:", error);
      setMessage("Error adding the starter");
    }
  };

  // Render the form for adding a new starter
  return (
    <div className="add-starter">
      <BackButton />
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
          <label>תיאור</label>
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
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
          />
        </div>

        <button type="submit">הוסף מנה ראשונה</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddStarter;
