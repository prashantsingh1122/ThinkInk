import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export const login = async (req, res) => {
  try {
    

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // ✅ Use JWT_SECRET from .env
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "50d" });

    res.json({ message: "Login successful", token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
