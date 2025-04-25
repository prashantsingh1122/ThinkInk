import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js"; // ✅ Ensure this is imported
import connectDB from "./config/db.js"; // ✅ Ensure this is imported 
import postRoutes from "./routes/posts.js"; // ✅ Ensure this is imported

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // ✅ Enable JSON parsing

// Simple CORS configuration for localhost
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ✅ API Routes
app.use("/api/auth", authRoutes); // Make sure this is correct
app.use("/api/posts",postRoutes); // Make sure this is correct  

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(process.env.PORT || 5000, 'localhost', () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((error) => console.error("❌ MongoDB Connection Error:", error));
