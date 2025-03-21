import express from "express";
import { createPost, getPosts, getPost, updatePost, deletePost } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js"; // Auth middleware to protect routes
import upload from "../middleware/uploadMiddleware.js"; // Multer middleware for file uploads   

const router = express.Router();

// Create a new post (Protected)
router.post("/", protect, createPost);

// Get all posts
router.get("/", getPosts);

// Get a single post by ID
router.get("/:id", getPost);

// Update a post (Protected)
router.put("/:id", protect, updatePost);

// Delete a post (Protected)
router.delete("/:id", protect, deletePost);

router.post("/", protect, upload.single("image"), createPost);


export default router;
