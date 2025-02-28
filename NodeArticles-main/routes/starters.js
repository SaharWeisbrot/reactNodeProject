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

// Route to get all starters
router.get("/", async (req, res) => {
  try {
    const db = await dbSingleton.getConnection(); // Get a database connection
    const [results] = await db.query(
      "SELECT id, name, price, image_url, description FROM starters" // Query to fetch all starters
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "No starters found" }); // Return 404 if no starters are found
    }

    res.json(results); // Return the fetched starters as JSON
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message }); // Handle database errors
  }
});

// Route to get a single starter by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params; // Extract the starter ID from the request parameters
  const query =
    "SELECT id, name, price, image_url, description FROM starters WHERE id = ?"; // Query to fetch a single starter

  try {
    const db = await dbSingleton.getConnection();
    const [results] = await db.query(query, [id]); // Execute the query with the starter ID

    if (results.length === 0) {
      return res.status(404).json({ message: "Starter not found" }); // Return 404 if the starter is not found
    }

    const starter = results[0]; // Extract the starter from the results

    // If the starter has an image, construct the full image URL
    if (starter.image_url) {
      starter.image_url = `${req.protocol}://${req.get("host")}${
        starter.image_url
      }`;
    }

    res.json(starter); // Return the starter as JSON
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message }); // Handle database errors
  }
});

// Route to add a new starter (with optional image upload)
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
    "INSERT INTO starters (name, price, image_url, description) VALUES (?, ?, ?, ?)"; // Query to insert a new starter

  try {
    const db = await dbSingleton.getConnection();
    const [results] = await db.query(query, [
      name,
      price,
      imageUrl,
      description,
    ]); // Execute the query

    res.json({
      message: "Starter added!",
      id: results.insertId, // Return the ID of the newly inserted starter
      starter: { name, price, image_url: imageUrl, description }, // Return the starter details
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message }); // Handle database errors
  }
});

// Route to update an existing starter (with optional image upload)
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params; // Extract the starter ID from the request parameters
  const { name, price, description } = req.body; // Extract name, price, and description from the request body

  if (!name || !price || !description) {
    return res
      .status(400)
      .json({ error: "Name, price and description are required" }); // Validate required fields
  }

  let query = "UPDATE starters SET name = ?, price = ?, description = ?"; // Base query for updating the starter
  const params = [name, price, description]; // Parameters for the query

  // If a new image was uploaded, add it to the query and parameters
  if (req.file) {
    query += ", image_url = ?";
    params.push(`/uploads/${req.file.filename}`);
  }

  query += " WHERE id = ?"; // Add the condition to update the specific starter
  params.push(id);

  try {
    const db = await dbSingleton.getConnection();
    await db.query(query, params); // Execute the query
    res.json({ message: "Starter updated!" }); // Return success message
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message }); // Handle database errors
  }
});

// Route to delete a starter
router.delete("/:id", async (req, res) => {
  const { id } = req.params; // Extract the starter ID from the request parameters
  const query = "DELETE FROM starters WHERE id = ?"; // Query to delete a starter

  try {
    const db = await dbSingleton.getConnection();
    await db.query(query, [id]); // Execute the query
    res.json({ message: "Starter deleted!" }); // Return success message
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message }); // Handle database errors
  }
});

module.exports = router; // Export the router for use in the main application
