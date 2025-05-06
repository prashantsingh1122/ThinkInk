import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js"; // ✅ Ensure this is imported
import connectDB from "./config/db.js"; // ✅ Ensure this is imported 
import postRoutes from "./routes/posts.js"; // ✅ Ensure this is imported
import aiRoutes from "./routes/ai.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // ✅ Enable JSON parsing

//ROUTS
app.use('/api/ai', aiRoutes); // ✅ this will make the full path '/api/ai/generate'

// Simple CORS configuration for localhost
// Configure CORS for specific frontend URL (Vercel URL)
const allowedOrigins = [
  'http://localhost:5173',
  'https://think-ink-jet.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy violation'));
    }
  },
  credentials: true, // If you're sending cookies or Authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


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

    // Use dynamic port binding for Render (0.0.0.0 for cloud environments)
    const port = process.env.PORT || 5000;
    app.listen(port, '0.0.0.0', () =>
      console.log(`🚀 Server running on port ${port}`)
    );
  })
  .catch((error) => console.error("❌ MongoDB Connection Error:", error));