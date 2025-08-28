import express from "express";
import {
  createPost, 
  getPosts,
  getPost,
  updatePost,
  getUserPosts,
  toggleLike,
  deletePost,
  toggleSavePost,
  getSavedPosts
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import Post from "../models/Post.js"; 

const router = express.Router();

// Create a new post (Protected)
router.post("/", protect, upload.single("image"), createPost);

// Get all posts
router.get("/", getPosts);

// Get current user's posts (Protected)
router.get("/me", protect, getUserPosts);

// Get current user's saved posts (Protected) - must be before :id
router.get("/saved", protect, getSavedPosts);

// Get a single post by ID
router.get("/:id", getPost);

// Update a post (Protected)
router.put('/:id', protect, updatePost);

router.post("/:id/comments", protect, async(req, res) => {
  const { text } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  const comment = {
    user: req.user._id,
    text,
  };
  post.comments.push(comment);
  await post.save();
  res.status(201).json({ message: "Comment added successfully" });
});

// Like api
router.post('/:id/like', protect, toggleLike);

// Toggle save/unsave a post (Protected)
router.post("/:id/save", protect, toggleSavePost);

// Delete a post (Protected)
router.delete("/:id", protect, deletePost);

export default router;