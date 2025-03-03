import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js"; // Import the signup route

dotenv.config();

const app = express();
app.use(express.json()); // ✅ Middleware to parse JSON
app.use(cors()); // ✅ Enable CORS

// ✅ API Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => console.error("❌ MongoDB Connection Error:", error));
