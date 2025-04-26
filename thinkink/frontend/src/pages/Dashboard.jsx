import { useState, useEffect,useContext } from "react";
import { getAllPosts } from "../services/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white pt-24 pb-12 px-8"
    >
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <motion.h1 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="text-4xl font-bold text-gray-900 mb-2"
            >
              <p className="text-gray-600">
            {user?.username ? `Hii, ${user.username}!` : 'Welcome back!'}
          </p>
            </motion.h1>
            <motion.h2 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              Welcome 
            </motion.h2>
          </div>
          
          {/* Create Post Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/create-post"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg 
                className="w-5 h-5 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
              Create Post
            </Link>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-16"
        >
          <input
            type="text"
            placeholder="Search for a topic"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 bg-gray-50 rounded-2xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all shadow-sm placeholder:text-gray-400"
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-gray-900 rounded-xl hover:bg-gray-800 transition-all duration-300">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </motion.div>

        {/* Today's Article Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            Today's Article
            <div className="h-1 w-24 bg-gray-900 rounded-full ml-4 opacity-20" />
          </h2>
          <motion.div 
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative overflow-hidden rounded-3xl shadow-xl bg-white group"
          >
            <Link to={posts[0]?._id ? `/posts/${posts[0]._id}` : "#"}>
              <img
                src={posts[0]?.image || "/placeholder.jpg"}
                alt="Featured"
                className="w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-10">
                  <span className="px-4 py-1.5 bg-white text-gray-900 rounded-full text-sm mb-4 inline-block font-medium">
                    Featured
                  </span>
                  <h3 className="text-3xl font-bold text-white mb-4">{posts[0]?.title || "Loading..."}</h3>
                  <p className="text-gray-200 text-lg max-w-3xl">
                    {posts[0]?.content?.slice(0, 150) + "..." || ""}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        {/* More Articles Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              More Articles
              <div className="h-1 w-16 bg-gray-900 rounded-full ml-4 opacity-20" />
            </h2>
            <Link 
              to="/all-posts" 
              className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.slice(1).map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={`/posts/${post._id}`}
                  className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={post.image || "/placeholder.jpg"}
                      alt={post.title}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm text-gray-900 font-medium">
                      3 min read
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.content?.slice(0, 100)}...</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {post.author?.username?.[0] || "U"}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {new Date(post.createdAt).toLocaleDateString()}
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
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
