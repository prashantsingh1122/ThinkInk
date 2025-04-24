import express from "express";
import {
  createPost, 
  getPosts,
  getPost,
  updatePost,
  getUserPosts,
  
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create a new post (Protected)
router.post("/", protect, upload.single("image"), createPost);

// Get all posts
router.get("/", getPosts);

// Get user's posts (Protected) - Move this above the :id route
router.get("/me", protect, getUserPosts);

// Get a single post by ID
router.get("/:id", getPost);

// Update a post (Protected)
router.put('/:id', protect, updatePost);

// Delete a post (Protected)


export default router;
