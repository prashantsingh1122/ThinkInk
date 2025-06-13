import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getPost } from "../services/api";
import { motion } from "framer-motion";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import axios from "axios";
document.documentElement.style.scrollBehavior = 'smooth';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();


  const { user, token } = useContext(AuthContext);
  const userId = user?._id;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const cleanId = id.trim();
        const res = await getPost(cleanId);
        setPost(res.data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const toggleLike = async () => {
    try {
      await axios.post(
        `/api/posts/${post._id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedPost = await getPost(post._id);
      setPost(updatedPost.data);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white text-xl">
        Loading post...
      </div>
    );
  }

  // Delete Post
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      console.log("Deleting post with ID:", post._id);
      const res = await axios.delete(`/api/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Delete response:", res.data);
      alert("✅ Post deleted successfully.");
      navigate("/dashboard"); // redirect to home
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("❌ Failed to delete post.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-12 text-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-slate-700 bg-opacity-40 backdrop-blur-lg rounded-xl shadow-2xl p-8 max-w-3xl w-full"
      >
        <h1 className="text-4xl font-bold text-pink-400 mb-4 text-center">
          {post.title}
        </h1>
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full rounded-lg shadow-md mb-6 object-cover max-h-[500px] transition duration-300 hover:scale-[1.01]"
          />
        )}
        <p className="text-lg text-slate-200 leading-relaxed text-center">
          {post.content}
        </p>

        <div className="flex flex-col items-center mt-6 space-y-2">
          <button
            onClick={toggleLike}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition"
          >
            {post.likes.includes(userId) ? "❤️ Liked" : "🤍 Like"}
          </button>
          <p className="text-sm text-slate-300">
            {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
          </p>
        </div>
        {userId === post.author && (
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => navigate(`/posts/${post._id}/edit`)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              ✏️ Edit Post
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              🗑️ Delete Post
            </button>
          </div>
        )}
        alert("Post loaded successfully!");

      </motion.div>
    </div>
  );
}
