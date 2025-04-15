import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,   // ✅ Ensure the content field is of type String
      ref: "user",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,   // ✅ Reference to the User model
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      default: null, // ✅ Default to null if no image is provided
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
