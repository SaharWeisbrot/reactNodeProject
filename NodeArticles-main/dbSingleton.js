const mysql = require("mysql2/promise"); // Importing mysql2 with Promise support

let connection; // Reusing a single connection instance for all requests

// Creating a Singleton for database connection
const dbSingleton = {
  // Function to get the database connection
  getConnection: async () => {
    // If a connection already exists, return it
    if (connection) {
      return connection;
    }

    try {
      // Creating a connection pool for better performance
      connection = await mysql.createPool({
        host: "localhost", // Database host
        user: "root", // Your database username
        password: "", // Your database password
        database: "myapp_db", // Your database name
        waitForConnections: true, // Wait for connection release if limit is reached
        connectionLimit: 10, // Maximum number of connections in the pool
        queueLimit: 0, // Unlimited request queue for connections
      });

      console.log("✅ Connected to MySQL!"); // Connection successful message
      return connection;
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error; // Throw error to handle it in calling functions
    }
  },
};

module.exports = dbSingleton; // Exporting the Singleton for use in other files
