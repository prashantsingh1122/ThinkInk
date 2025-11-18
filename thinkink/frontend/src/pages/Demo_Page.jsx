import { useState, useEffect } from "react";
import { getAllPosts } from "../services/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

document.documentElement.style.scrollBehavior = 'smooth';

export default function Demo() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getAllPosts();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const query = searchQuery.toLowerCase();
    return (
      post.title?.toLowerCase().includes(query) ||
      post.author?.username?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-white text-black pt-20 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            Explore ThinkInk
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Browse our community's latest articles and insights. Sign in to create, like, and save your favorite posts.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mb-8">
            <Link
              to="/signup"
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
            >
              Sign Up to Create
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors font-medium"
            >
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
          />
        </motion.div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <p className="text-gray-500 text-lg">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg">
              {searchQuery ? "No posts found." : "No posts yet. Be the first to create one!"}
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {post.image && (
                  <div className="h-48 w-full overflow-hidden bg-gray-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h2 className="text-xl font-bold text-black mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {post.content?.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 150)}
                    {post.content?.length > 150 ? "…" : ""}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      <div className="font-medium text-black">
                        {post.author?.username || "Unknown"}
                      </div>
                      <div className="text-xs mt-1">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Link
                      to={`/posts/${post._id}`}
                      className="text-black font-medium hover:underline"
                    >
                      Read →
                    </Link>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 mt-3 text-xs text-gray-500">
                    <span>❤️ {post.likes?.length || 0}</span>
                    <span>💬 {post.comments?.length || 0}</span>
                  </div>

                  {/* Demo Badge */}
                  <div className="mt-3 px-3 py-1 bg-gray-100 text-black text-xs rounded-full inline-block">
                    👁️ Demo View
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* Demo Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 p-8 bg-gray-50 rounded-xl border-2 border-gray-200"
        >
          <h3 className="text-2xl font-bold mb-4">🔒 Demo Limitations</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Browse all published posts</li>
            <li>✓ Read individual post details</li>
            <li>✗ Cannot like or save posts (sign in required)</li>
            <li>✗ Cannot comment or create posts (sign in required)</li>
            <li>✗ Cannot access your profile or dashboard</li>
          </ul>
          <p className="mt-6 text-sm text-gray-600">
            <Link to="/signup" className="text-black font-bold hover:underline">
              Sign up now
            </Link>
            {" "}to unlock all features and start creating your own content!
          </p>
        </motion.div>
      </div>
    </div>
  );
}