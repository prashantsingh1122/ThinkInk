import express from "express";
import {
  createPost, getPosts,getPost, updatePost,deletePost,} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create a new post (Protected)
router.post("/", protect, upload.single("image"), createPost);

// Get all posts
router.get("/", getPosts);

// Get a single post by ID
router.get("/:id", getPost);

// Update a post (Protected)
router.put("/:id", protect, updatePost);

// Delete a post (Protected)
router.delete("/:id", protect, deletePost);

router.get('/', protect, getPosts); // ⬅️ this route

export default router;
