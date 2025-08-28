import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"], // Ensures username is provided
      unique: true, // Prevents duplicate usernames
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Prevents duplicate emails
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },

    // NEW: saved posts (references to Post)
    saved: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

// Prevent multiple model compilation
const User = mongoose.models.User || mongoose.model("User", UserSchema); // Corrected this line
export default User;
