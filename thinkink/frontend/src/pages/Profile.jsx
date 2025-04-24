import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getUserPosts } from '../services/api';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserPosts();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch user posts:", err);
        setError("Failed to load your posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserPosts();
    }
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen bg-white pt-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-gray-600">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Posts</h1>
          <p className="text-gray-600">
            {user?.username ? `Welcome back, ${user.username}!` : 'Welcome back!'}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-6">Start writing your first post!</p>
            <Link
              to="/create-post"
              className="inline-flex items-center px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
            >
              Create Post
            </Link>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                {post.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/posts/${post._id}`}
                      className="text-gray-900 font-medium text-sm hover:translate-x-1 transition-transform inline-block"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
