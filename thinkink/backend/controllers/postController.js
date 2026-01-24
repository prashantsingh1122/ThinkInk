import Post from '../models/Post.js';
import User from '../models/userModel.js';
import { cacheGet, cacheSet, cacheDelete, isRedisAvailable } from '../utils/redis.js';

const POSTS_FEED_CACHE_KEY = 'posts:feed';
const POSTS_FEED_MAX = 20;       // cache up to 20 most recent posts
const POSTS_FEED_TTL = 30 * 60;  // 30 minutes
const POSTS_ITEM_TTL = 60 * 60;  // 1 hr  for single post (GET /:id)

function postItemCacheKey(id) {
  return `posts:item:${id}`;
}

// Get all posts (first 10–20 use Redis cache when ?limit=10 or ?limit=20)
export const getPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10);
    const page = req.query.page;
    const useCache = limit >= 1 && limit <= POSTS_FEED_MAX && (!page || page === '1');

    if (useCache && isRedisAvailable()) {
      const cached = await cacheGet(POSTS_FEED_CACHE_KEY);
      if (cached && Array.isArray(cached) && cached.length > 0) {
        return res.status(200).json(cached.slice(0, limit));
      }
    }

    if (useCache) {
      const posts = await Post.find()
        .populate('author', 'username email')
        .sort({ createdAt: -1 })
        .limit(POSTS_FEED_MAX)
        .lean();
      if (isRedisAvailable()) {
        await cacheSet(POSTS_FEED_CACHE_KEY, posts, POSTS_FEED_TTL);
      }
      return res.status(200).json(posts.slice(0, limit));
    }

    // No cache: return all posts (existing behavior). Warm cache with first 20 for next time.
    const posts = await Post.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    if (isRedisAvailable() && posts.length > 0) {
      const head = posts.slice(0, POSTS_FEED_MAX).map((p) => (p.toObject ? p.toObject() : p));
      await cacheSet(POSTS_FEED_CACHE_KEY, head, POSTS_FEED_TTL);
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

// Get single post by ID (cached in Redis; cleared on update/delete)
export const getPost = async (req, res) => {
  try {
    const id = req.params.id;
    if (isRedisAvailable()) {
      const cached = await cacheGet(postItemCacheKey(id));
      if (cached && cached._id) return res.status(200).json(cached);
    }

    const post = await Post.findById(id)
      .populate('author', 'username email')
      .lean();
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (isRedisAvailable()) await cacheSet(postItemCacheKey(id), post, POSTS_ITEM_TTL);
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
    if (isRedisAvailable()) await cacheDelete(POSTS_FEED_CACHE_KEY);
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
    if (isRedisAvailable()) {
      await cacheDelete(POSTS_FEED_CACHE_KEY);
      await cacheDelete(postItemCacheKey(postId));
    }
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
    if (isRedisAvailable()) {
      await cacheDelete(POSTS_FEED_CACHE_KEY);
      await cacheDelete(postItemCacheKey(postId));
    }
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
    if (isRedisAvailable()) await cacheDelete(postItemCacheKey(postId));
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