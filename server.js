import dotenv from "dotenv";
dotenv.config();

import express from "express";
import jwt from "jsonwebtoken";
import connectDB from "./config.js"; // Ensure config.js exports connectDB function
import "./db.js"; // Import database connection

// Connect to Database
connectDB();

const app = express();
app.use(express.json()); // Middleware to parse JSON

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // e.g., "7d"
  });
};

// Example: Login Route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "password") {
    const token = generateToken("12345"); // Replace with actual user ID
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

// Protected Route Example
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid Token" });
  }
};

app.get("/protected", authenticate, (req, res) => {
  res.json({ message: "Welcome to the protected route!", user: req.user });
});

// Basic Route
app.get("/", (req, res) => {
  res.send("Hello, Backend is Running!");
});

// Start Server
const PORT = process.env.PORT; // Remove fallback
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
