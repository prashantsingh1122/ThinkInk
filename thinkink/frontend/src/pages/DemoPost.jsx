import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPost, generateSummary } from "../services/api";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

document.documentElement.style.scrollBehavior = 'smooth';

export default function DemoPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const cleanId = id?.trim();
        if (!cleanId) return;
        const res = await getPost(cleanId);
        setPost(res.data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
      }
    };
    fetchPost();
  }, [id]);

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
      <div className="flex items-center justify-center h-screen bg-white text-black text-xl">
        Loading post...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8"
      >
        <div className="mb-6">
          <Link to="/demo" className="text-sm text-gray-600 hover:underline">
            ← Back to Posts
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-4 text-black">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-6">
          <div className="font-medium text-black">{post.author?.username || "Unknown"}</div>
          <div>{new Date(post.createdAt).toLocaleDateString()}</div>
        </div>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full rounded-md mb-6 object-cover max-h-[520px]"
          />
        )}

        {/* Properly spaced readable HTML content */}
        <article
          className="prose prose-lg max-w-none text-black leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSummarize}
            disabled={loading}
            className="px-4 py-2 bg-gray-900 text-white rounded"
          >
            {loading ? "Summarizing..." : "Auto-summarize"}
          </button>
          <div className="text-sm text-gray-600">❤️ {post.likes?.length || 0} • 💬 {post.comments?.length || 0}</div>
        </div>

        {summary && (
          <div className="mt-6 p-4 bg-gray-50 rounded border">
            <h3 className="font-semibold mb-2">Summary</h3>
            <p className="text-gray-800">{summary}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}