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

// Route to get all main dishes
router.get("/", async (req, res) => {
  try {
    const db = await dbSingleton.getConnection(); // Get a database connection
    const [results] = await db.query(
      "SELECT id, name, price, image_url, description FROM main_dishes" // Query to fetch all main dishes
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "No main dishes found" }); // Return 404 if no main dishes are found
    }

    res.json(results); // Return the fetched main dishes as JSON
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message }); // Handle database errors
  }
});

// Route to get a single main dish by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params; // Extract the main dish ID from the request parameters
  const query =
    "SELECT id, name, price, image_url, description FROM main_dishes WHERE id = ?"; // Query to fetch a single main dish

  try {
    const db = await dbSingleton.getConnection();
    const [results] = await db.query(query, [id]); // Execute the query with the main dish ID

    if (results.length === 0) {
      return res.status(404).json({ message: "Main dish not found" }); // Return 404 if the main dish is not found
    }

    const mainDish = results[0]; // Extract the main dish from the results

    // If the main dish has an image, construct the full image URL
    if (mainDish.image_url) {
      mainDish.image_url = `${req.protocol}://${req.get("host")}${
        mainDish.image_url
      }`;
    }

    res.json(mainDish); // Return the main dish as JSON
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message }); // Handle database errors
  }
});

// Route to add a new main dish (with optional image upload)
router.post("/", upload.single("image"), async (req, res) => {
  const { name, price, description } = req.body; // Extract name, price, and description from the request body

  if (!name || !price || !description) {
    return res
      .status(400)
      .json({ error: "Name, price and description are required" }); // Validate required fields
  }

  // Construct the image URL if a file was uploaded
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const query =
    "INSERT INTO main_dishes (name, price, image_url, description) VALUES (?, ?, ?, ?)"; // Query to insert a new main dish

  try {
    const db = await dbSingleton.getConnection();
    const [results] = await db.query(query, [
      name,
      price,
      imageUrl,
      description,
    ]); // Execute the query

    res.json({
      message: "Main dish added!",
      id: results.insertId, // Return the ID of the newly inserted main dish
      main_dish: { name, price, image_url: imageUrl, description }, // Return the main dish details
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message }); // Handle database errors
  }
});

// Route to update an existing main dish (with optional image upload)
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params; // Extract the main dish ID from the request parameters
  const { name, price, description } = req.body; // Extract name, price, and description from the request body

  if (!name || !price || !description) {
    return res
      .status(400)
      .json({ error: "Name, price and description are required" }); // Validate required fields
  }

  let query = "UPDATE main_dishes SET name = ?, price = ?, description = ?"; // Base query for updating the main dish
  const params = [name, price, description]; // Parameters for the query

  // If a new image was uploaded, add it to the query and parameters
  if (req.file) {
    query += ", image_url = ?";
    params.push(`/uploads/${req.file.filename}`);
  }

  query += " WHERE id = ?"; // Add the condition to update the specific main dish
  params.push(id);

  try {
    const db = await dbSingleton.getConnection();
    await db.query(query, params); // Execute the query
    res.json({ message: "Main dish updated!" }); // Return success message
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message }); // Handle database errors
  }
});

// Route to delete a main dish
router.delete("/:id", async (req, res) => {
  const { id } = req.params; // Extract the main dish ID from the request parameters
  const query = "DELETE FROM main_dishes WHERE id = ?"; // Query to delete a main dish

  try {
    const db = await dbSingleton.getConnection();
    await db.query(query, [id]); // Execute the query
    res.json({ message: "Main dish deleted!" }); // Return success message
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message }); // Handle database errors
  }
});

module.exports = router; // Export the router for use in the main application
