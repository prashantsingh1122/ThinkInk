import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPost } from "../services/api";
import { motion } from "framer-motion";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  const handleAddComment = async () => {
    await axios.post(`/api/posts/${postId}/comments`, { text: newComment }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNewComment("");
    fetchPost(); // Refresh post
  };
  const toggleLike = async () => {
    const res = await axios.post(`/api/posts/${post._id}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchPost(); // refresh post data
  };


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const cleanId = id.trim();
        console.log("Fetching post with ID:", cleanId);
        const res = await getPost(cleanId);
        console.log("Post fetched:", res.data);
        setPost(res.data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white text-xl">
        Loading post...
      </div>
    );
  }

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
        <div className="flex space-x-4">
          <button onClick={toggleLike}>
            {post.likes.includes(userId) ? '❤️ Liked' : '🤍 Like'}
          </button>
          <button onClick={toggleBookmark}>
            {post.bookmarks.includes(userId) ? '🔖 Bookmarked' : '📄 Bookmark'}
          </button>
        </div>

        <div>
          {post.comments.map(c => (
            <div key={c._id}>
              <p><strong>{c.user.username}</strong>: {c.text}</p>
            </div>
          ))}
        </div>

      </motion.div>
    </div>
  );
}
