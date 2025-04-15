import Post from "../models/Post.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";
import User from "../models/userModel.js";  // ✅ Import the User model

export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    let imageUrl = null;

    // Check if an image file is present
    if (req.file) {
      console.log("📝 Image received:", req.file);
      imageUrl = await uploadImageToCloudinary(req.file.buffer);
      console.log("✅ Image uploaded successfully:", imageUrl);
    }

    const newPost = new Post({
      title,
      content,
      image: imageUrl,
      author: userId,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("🚨 Create Post Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// Get all posts
export const getPosts = async (req, res) => {
  try {
    console.log("Fetching all posts...");
    const posts = await Post.find()
      .populate("author", "username email")  // Populate author details
      .sort({ createdAt: -1 });  // Sort by latest
      console.log("Posts fetched successfully:", posts);
    res.json(posts);
  } catch (error) {
    console.error("Get Posts Error:", error);
    res.status(500).json({ error: "Failing to get post" });
  }
};

// ✅ Get a single post
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username email");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Get Post Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Update a post
export const updatePost = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Ensure the user is the author of the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.image = image || post.image;

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error("Update Post Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// ✅ Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Ensure the user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete Post Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

};
