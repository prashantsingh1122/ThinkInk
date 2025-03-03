import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Ensure correct path
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ✅ Signup Route
router.post("/signup", async (req, res) => {
  try {
    console.log("🔹 Signup request received:", req.body); // Debug log

    const { name, email, password } = req.body;

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create New User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("✅ User created successfully:", newUser);

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
