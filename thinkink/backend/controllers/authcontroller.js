import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ✅ Validate input fields
    if (!username || !email || !password) {
      console.log("❌ Signup Error: Missing required fields");
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Ensure email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Signup Error: Invalid email format");
      return res.status(400).json({ error: "Invalid email format" });
    }

    // ✅ Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      console.log("❌ Signup Error: Username or email already exists");
      return res.status(400).json({ error: "Username or email already exists" });
    }

    // ✅ Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    console.log(`✅ New user registered: ${username} (${email})`);

    res.status(201).json({
      message: "User registered successfully!",
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
