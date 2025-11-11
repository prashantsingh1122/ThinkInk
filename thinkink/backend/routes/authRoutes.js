import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js"; // ✅ Correct import

const router = express.Router();

// ✅ Add the /me route (Protected)
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 POST alias for /me (same behavior as GET /me)
router.post("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Signup Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🔹 Login Route
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    // Normalize email to improve matching with legacy records
    email = (email || "").trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Primary: bcrypt compare
    let isMatch = await bcrypt.compare(password, user.password);

    // Fallback for legacy plaintext-stored passwords (rehash on the fly)
    if (!isMatch) {
      const looksHashed = typeof user.password === 'string' && user.password.startsWith('$2');
      if (!looksHashed && password === user.password) {
        // Upgrade: rehash and save
        const newHash = await bcrypt.hash(password, 10);
        user.password = newHash;
        await user.save();
        isMatch = true;
      }
    }

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
