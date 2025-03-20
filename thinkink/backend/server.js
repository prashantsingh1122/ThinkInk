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
app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  credentials: true
})); // ✅ Enable CORS

// ✅ API Routes
app.use("/api/auth", authRoutes); // Make sure this is correct
app.use("/api/posts",postRoutes); // Make sure this is correct  

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ HOGYA MANGUDIBBA");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((error) => console.error("❌ MongoDB Connection Error:", error));
