import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

export const protect = async (req, res, next) => {
  let token;

  // ✅ Check if the token exists in the authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // ✅ Extract the token from the "Bearer <token>" format
      token = req.headers.authorization.split(" ")[1];

      // ✅ Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Find the user and attach to the request object (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error("❌ Auth Middleware Error:", error.message);
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  // ✅ If no token is found
  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token provided" });
  }
};
