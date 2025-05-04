import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });

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
    comments:[commentSchema], // ✅ Embed the comment schema directly in the Post schema
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
