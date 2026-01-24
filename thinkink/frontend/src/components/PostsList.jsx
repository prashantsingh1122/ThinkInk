import { useState, useEffect } from "react";
import { getAllPosts } from "../services/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const categories = ["All", "Design", "Technology", "Development", "Business"];

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Articles
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover inspiring ideas and insights from our community
          </p>
        </motion.div>

        {/* Categories Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(category.toLowerCase())}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                filter === category.toLowerCase()
                  ? "bg-gray-900 text-white shadow-lg"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link
                to={`/posts/${post._id}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image || "/placeholder.jpg"}
                    alt={post.title}
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm text-gray-900 font-medium">
                    3 min read
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-sm font-medium">
                      Design
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {post.author?.username?.[0] || "U"}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {post.author?.username || "Unknown"}
                      </span>
                    </div>
                    <span className="text-gray-900 font-medium text-sm group-hover:translate-x-1 transition-transform">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Posts Found
            </h3>
            <p className="text-gray-600">
              Start creating your first post to share with the community.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PostsList;
