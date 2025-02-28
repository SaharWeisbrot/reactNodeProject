const express = require("express");
const router = express.Router();
const dbSingleton = require("../dbSingleton"); // Import the database connection singleton
const multer = require("multer"); // Import Multer for handling file uploads
const path = require("path"); // Import the path module for file path manipulation

// Configure Multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save uploaded files to the "uploads" folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using the current timestamp and the original file extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }); // Initialize Multer with the configured storage

// Route to get all categories
router.get("/", async (req, res) => {
  try {
    const db = await dbSingleton.getConnection(); // Get a database connection
    const [results] = await db.query(
      "SELECT id, title, content, image FROM categories" // Query to fetch all categories
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "No categories found" }); // Return 404 if no categories are found
    }

    res.json(results); // Return the fetched categories as JSON
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message }); // Handle database errors
  }
});

// Route to get a single category by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params; // Extract the category ID from the request parameters
  const query = "SELECT id, title, content, image FROM categories WHERE id = ?"; // Query to fetch a single category

  try {
    const db = await dbSingleton.getConnection();
    const [results] = await db.query(query, [id]); // Execute the query with the category ID

    if (results.length === 0) {
      return res.status(404).json({ message: "Category not found" }); // Return 404 if the category is not found
    }

    const category = results[0]; // Extract the category from the results

    // If the category has an image, construct the full image URL
    if (category.image) {
      category.image = `${req.protocol}://${req.get("host")}${category.image}`;
    }

    res.json(category); // Return the category as JSON
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message }); // Handle database errors
  }
});

// Route to add a new category (with optional image upload)
router.post("/", upload.single("image"), async (req, res) => {
  const { title, content } = req.body; // Extract title and content from the request body

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" }); // Validate required fields
  }

  // Construct the image URL if a file was uploaded
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const query =
    "INSERT INTO categories (title, content, image) VALUES (?, ?, ?)"; // Query to insert a new category

  try {
    const db = await dbSingleton.getConnection();
    const [results] = await db.query(query, [title, content, imageUrl]); // Execute the query

    res.json({
      message: "Category added!",
      id: results.insertId, // Return the ID of the newly inserted category
      category: { title, content, image: imageUrl }, // Return the category details
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message }); // Handle database errors
  }
});

// Route to update an existing category (with optional image upload)
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params; // Extract the category ID from the request parameters
  const { title, content } = req.body; // Extract title and content from the request body

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" }); // Validate required fields
  }

  let query = "UPDATE categories SET title = ?, content = ?"; // Base query for updating the category
  const params = [title, content]; // Parameters for the query

  // If a new image was uploaded, add it to the query and parameters
  if (req.file) {
    query += ", image = ?";
    params.push(`/uploads/${req.file.filename}`);
  }

  query += " WHERE id = ?"; // Add the condition to update the specific category
  params.push(id);

  try {
    const db = await dbSingleton.getConnection();
    await db.query(query, params); // Execute the query
    res.json({ message: "Category updated!" }); // Return success message
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message }); // Handle database errors
  }
});

// Route to delete a category
router.delete("/:id", async (req, res) => {
  const { id } = req.params; // Extract the category ID from the request parameters
  const query = "DELETE FROM categories WHERE id = ?"; // Query to delete a category

  try {
    const db = await dbSingleton.getConnection();
    await db.query(query, [id]); // Execute the query
    res.json({ message: "Category deleted!" }); // Return success message
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message }); // Handle database errors
  }
});

module.exports = router; // Export the router for use in the main application
