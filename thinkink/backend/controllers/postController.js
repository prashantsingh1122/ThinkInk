import Post from '../models/Post.js';
import User from '../models/userModel.js';

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

// Get single post by ID
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username email');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Error fetching post' });
  }
};

// Create new post
export const createPost = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const newPost = new Post({
      title,
      content,
      image,
      author: req.user.id
    });
    
    const savedPost = await newPost.save();
    const populatedPost = await Post.findById(savedPost._id)
      .populate('author', 'username email');
    
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const postId = req.params.id;
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }
    
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content, image },
      { new: true }
    ).populate('author', 'username email');
    
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Error updating post' });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    
    await Post.findByIdAndDelete(postId);
    
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
};

// Like/Unlike post
export const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const isLiked = post.likes.includes(userId);
    
    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      // Like
      post.likes.push(userId);
    }
    
    await post.save();
    
    const updatedPost = await Post.findById(postId)
      .populate('author', 'username email');
    
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Error toggling like' });
  }
};

// Get user's posts
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    const posts = await Post.find({ author: userId })
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Error fetching user posts' });
  }
};

// Toggle Save / Unsave post for current user
export const toggleSavePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadySaved = user.saved.some((s) => s.toString() === postId);

    if (alreadySaved) {
      user.saved = user.saved.filter((s) => s.toString() !== postId);
    } else {
      user.saved.push(postId);
    }

    await user.save();

    // Optionally return the saved array or the populated saved posts
    const populated = await User.findById(userId).populate({
      path: "saved",
      populate: { path: "author", select: "username email" },
    });

    res.status(200).json({ saved: populated.saved });
  } catch (error) {
    console.error("Error toggling saved post:", error);
    res.status(500).json({ message: "Error toggling saved post" });
  }
};

// Get saved posts for current user
export const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
      path: "saved",
      populate: { path: "author", select: "username email" },
      options: { sort: { createdAt: -1 } },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.saved || []);
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    res.status(500).json({ message: "Error fetching saved posts" });
  }
};