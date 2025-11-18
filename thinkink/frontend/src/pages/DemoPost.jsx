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
    <div className="min-h-screen bg-white text-black px-4 py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header with back link */}
        <div className="mb-8 flex items-center gap-2">
          <Link to="/demo" className="text-sm text-gray-600 hover:text-black transition-colors font-medium">
            ← Back to Posts
          </Link>
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-black leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 border-b border-gray-200 pb-6">
            <div>
              <div className="font-medium text-black text-base">{post.author?.username || "Unknown"}</div>
            </div>
            <div className="text-gray-500">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="text-gray-500 ml-auto">
              ❤️ {post.likes?.length || 0} • 💬 {post.comments?.length || 0}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto object-cover max-h-96"
            />
          </motion.div>
        )}

        {/* Main Content - wider with proper spacing */}
        <article
          className="prose prose-xl max-w-none text-black text-lg leading-8 mb-12"
          style={{
            '--tw-prose-body': 'rgb(0, 0, 0)',
            '--tw-prose-headings': 'rgb(0, 0, 0)',
            '--tw-prose-bold': 'rgb(0, 0, 0)',
            '--tw-prose-links': 'rgb(0, 0, 0)',
          }}
          dangerouslySetInnerHTML={{
            __html: post.content?.replace(
              /<p>/g,
              '<p style="margin-bottom: 1.5rem; text-align: justify; line-height: 1.8;">'
            ) || '<p>No content available</p>'
          }}
        />

        {/* Divider */}
        <div className="my-12 border-t-2 border-gray-200"></div>

        {/* Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <button
            onClick={handleSummarize}
            disabled={loading}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? "Summarizing..." : "✨ Auto-summarize"}
          </button>
        </motion.div>

        {/* Summary Section */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 rounded-lg p-8 mb-12 border-l-4 border-black"
          >
            <h3 className="font-bold text-xl mb-4 text-black">📝 Summary</h3>
            <p className="text-gray-800 text-base leading-8 text-justify">{summary}</p>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black text-white rounded-lg p-8 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Want to create your own posts?</h3>
          <p className="mb-6 text-gray-300">Join ThinkInk today and start sharing your thoughts with the community.</p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/signup"
              className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-black transition-colors font-medium"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}