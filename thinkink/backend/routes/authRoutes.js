import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    console.log("🔹 Signup request received:", req.body); // Debugging log

    // Extract data properly
    const { username, email, password } = req.body;

    // Check if required fields are present
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
