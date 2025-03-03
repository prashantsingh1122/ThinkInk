import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ✅ Check if all fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    // ✅ Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Save new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
