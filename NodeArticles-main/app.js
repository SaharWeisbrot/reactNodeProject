// Sahar Weisbroot

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const session = require("express-session");

const app = express();
const port = 8801;

// Session setup - used to maintain user sessions
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Note: In HTTPS, set secure to true
  })
);

// Configuring multer to store uploaded files in the "uploads" folder
const upload = multer({
  dest: "uploads/", // Uploaded images will be saved in the "uploads" folder
});

// CORS setup - Allowing requests from the React frontend
app.use(
  cors({
    origin: "http://localhost:3000", // React application address
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Allowing cookies to be sent with requests
  })
);
app.use(express.json()); // Enabling JSON parsing for request bodies

// Serving static files from the "uploads" directory
app.use("/uploads", express.static("uploads"));

// Importing route handlers
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const starterRoutes = require("./routes/starters"); // Importing starter dishes routes
const mainDishesRoutes = require("./routes/mainDishes"); // Importing main dishes routes

// Registering route handlers
app.use("/users", userRoutes);
app.use("/prods", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/starters", starterRoutes); // Route for starter dishes
app.use("/mainDishes", mainDishesRoutes); // Route for main dishes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err); // Logging the error to the console
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

// Starting the server and listening for requests
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
