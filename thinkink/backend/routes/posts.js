import express from "express";
import {
  createPost, getPosts,getPost,
   } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create a new post (Protected)
router.post("/", protect, upload.single("image"), createPost);

// Get all posts
router.get("/", getPosts);

// Get a single post by ID
router.get("/api/posts/:id",protect, getPost);

// Update a post (Protected)


router.get('/', protect, getPosts); // ⬅️ this route



// routes/posts.js


export default router;
