import Post from "../models/Post.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";
import User from "../models/userModel.js";  // ✅ Import the User model
import mongoose from "mongoose";



// ✅ Import the Post model

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
// Make sure this is imported


export const getPost = async (req, res) => {
  const { id } = req.params;

  // Check if the id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    const post = await Post.findById(id); // Query the post by ID
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post); // Send the post details
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};






// ✅ Update a post
// ✅ PUT /api/posts/:id
export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.userId; // assuming your auth middleware sets req.userId

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized to edit this post" });
    }

    // Update post fields
    const { title, content, image } = req.body;
    post.title = title || post.title;
    post.content = content || post.content;
    if (image) post.image = image;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    console.error("❌ Error updating post:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get posts created by logged-in user
export const getUserPosts = async (req, res) => {
  try {
    // Ensure user exists in request
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false,
        message: 'User not authenticated'
      });
    }

    const userId = req.user._id;
    console.log('Fetching posts for user:', userId);

    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate('author', 'username email');

    console.log(`Found ${posts.length} posts for user ${userId}`);

    return res.status(200).json({
      success: true,
      posts: posts
    });
  } catch (error) {
    console.error('Error in getUserPosts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user posts',
      error: error.message
    });
  }
};




