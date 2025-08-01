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
import Post from "../models/Post.js"; 

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

router.post("/:id/comments", protect, async(req, res) => {
  const{text}=req.body;
  const post=await Post.findById(req.params.id);
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

//LIke api
router.post('/:id/like', protect, toggleLikePost);



// Delete a post (Protected)
router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



export default router;
