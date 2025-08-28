import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getPost, toggleSavePost } from "../services/api"; // add toggleSavePost
import { motion } from "framer-motion";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { generateSummary } from "../services/api";

import axios from "axios";
document.documentElement.style.scrollBehavior = 'smooth';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
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

  useEffect(() => {
    if (!post) return;
    // determine saved status using user.saved (handle populated or ids)
    const savedList = user?.saved || [];
    const savedIds = savedList.map(s => (typeof s === 'object' ? s._id : s));
    setIsSaved(savedIds.includes(String(post._id)));
  }, [post, user]);

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

  const handleSummarize = async () => {
    try {
      setLoading(true);
      const res = await generateSummary(post._id);
      setSummary(res.summary);
    } catch (err) {
      alert("Summarization failed");
    } finally {
      setLoading(false);
    }
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white text-xl">
        Loading post...
      </div>
    );
  }

  // helper to get author id whether author is populated object or id string
  const authorId = post?.author?._id || post?.author;

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
      navigate("/dashboard"); // redirect to dashboard
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("❌ Failed to delete post.");
    }
  };

  const handleToggleSave = async () => {
    if (!token) {
      alert("Please login to save posts.");
      return;
    }
    try {
      const resp = await toggleSavePost(post._id);
      // resp.saved is an array of posts (populated) or ids
      const savedIds = (resp.saved || []).map(s => (s._id ? s._id : s));
      setIsSaved(savedIds.includes(String(post._id)));
      alert(isSaved ? "Removed from saved." : "Saved to your profile.");
    } catch (err) {
      console.error("Error toggling save:", err);
      alert("Failed to save post.");
    }
  };

  const isAuthor = String(userId) && String(userId) === String(authorId);

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
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="mt-6 space-x-2">
          <button onClick={handleSummarize} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">
            {loading ? "Summarizing..." : "Auto-summarize"}
          </button>

          {token && (
            <button
              onClick={handleToggleSave}
              className={`px-4 py-2 rounded ${isSaved ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-white'}`}
            >
              {isSaved ? '★ Saved' : '☆ Save'}
            </button>
          )}
        </div>

        {summary ? (
          <div className="mt-6 p-4 bg-gray-800 text-white rounded">
            <h3 className="font-semibold">Summary</h3>
            <p>{summary}</p>
          </div>
        ) : null}

        <div className="flex flex-col items-center mt-6 space-y-2">
          <button
            onClick={toggleLike}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition"
          >
            {post.likes && post.likes.map(l => String(l)).includes(String(userId)) ? "❤️ Liked" : "🤍 Like"}
          </button>
          <p className="text-sm text-slate-300">
            {post.likes?.length || 0} {(post.likes?.length || 0) === 1 ? "like" : "likes"}
          </p>
        </div>
        {isAuthor && (
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

      </motion.div>
    </div>
  );
}
