import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js"; // ✅ Ensure this is imported

dotenv.config();

const app = express();
app.use(express.json()); // ✅ Enable JSON parsing
app.use(cors()); // ✅ Enable CORS

// ✅ API Routes
app.use("/api/auth", authRoutes); // Make sure this is correct

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((error) => console.error("❌ MongoDB Connection Error:", error));
