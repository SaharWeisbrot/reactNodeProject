const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../dbSingleton");
const session = require("express-session");

const router = express.Router();

// Session setup - used to maintain user sessions
router.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Note: In HTTPS, set secure to true
  })
);

// Signup - Create a new user
router.post("/signup", async (req, res) => {
  const { email, password, full_name, phone_number, birthday, permission } =
    req.body;

  try {
    const connection = await db.getConnection();

    // Check if the user already exists
    const [existingUser] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await connection.query(
      "INSERT INTO users (email, password, full_name, phone_number, birthday, permission) VALUES (?, ?, ?, ?, ?, ?)",
      [email, hashedPassword, full_name, phone_number, birthday, permission]
    );

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login - Check user credentials and authenticate
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await db.getConnection();

    // Find the user in the database
    const [user] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (!user || user.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate a JWT token upon successful login
    const token = jwt.sign(
      { userId: user[0].id, permission: user[0].permission },
      "secretkey", // Secret key should be stored securely
      { expiresIn: "1h" } // Token expiration time
    );

    // Store user information in session
    req.session.user = {
      id: user[0].id,
      email: user[0].email,
      full_name: user[0].full_name,
      permission: user[0].permission,
    };

    res.json({
      message: "Login successful!",
      token,
      permission: user[0].permission,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update user details
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { full_name, email, permission } = req.body;

  // Check if the user is logged in and is an admin
  if (!req.session.user || req.session.user.permission !== "admin") {
    return res.status(403).json({ message: "Permission denied" });
  }

  try {
    const connection = await db.getConnection();

    // Update user information in the database
    await connection.query(
      "UPDATE users SET full_name = ?, email = ?, permission = ? WHERE id = ?",
      [full_name, email, permission, id]
    );

    res.json({ message: "User updated successfully!" });
  } catch (error) {
    console.error("User update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  // Check if the user is logged in and is an admin
  if (!req.session.user || req.session.user.permission !== "admin") {
    return res.status(403).json({ message: "Permission denied" });
  }

  try {
    const connection = await db.getConnection();

    // Delete the user from the database
    await connection.query("DELETE FROM users WHERE id = ?", [id]);

    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("User deletion error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Middleware to authenticate user by JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "Token not provided" });
  }

  jwt.verify(token, "secretkey", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Get the currently logged in user's details
router.get("/session", authenticateJWT, async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [user] = await connection.query(
      "SELECT id, email, full_name, permission FROM users WHERE id = ?",
      [req.user.userId]
    );

    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user[0]); // Send user details as response
  } catch (error) {
    console.error("Get user session error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all users - Only for logged in users
router.get("/", async (req, res) => {
  // Check if the user is logged in
  if (!req.session.user) {
    return res.status(401).json({ message: "Please log in first" });
  }

  try {
    const connection = await db.getConnection();
    const [users] = await connection.query("SELECT * FROM users");
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
