import { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import { getUserPosts, getSavedPosts } from '../services/api'; // add getSavedPosts
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('posts'); // 'posts' | 'saved'
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
        setError("It seems you haven't created any post.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserPosts();
    }
  }, [token]);

  useEffect(() => {
    if (tab !== 'saved' || !token) return;

    const fetchSaved = async () => {
      try {
        setLoading(true);
        const data = await getSavedPosts();
        setSavedPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch saved posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [tab, token]);

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

  const listToRender = tab === 'posts' ? posts : savedPosts;

  return (
    <div className="min-h-screen bg-white pt-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-gray-600">
            {user?.username ? `Welcome back, ${user.username}!` : 'Welcome back!'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setTab('posts')}
            className={`px-4 py-2 rounded ${tab === 'posts' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Your Posts
          </button>
          <button
            onClick={() => setTab('saved')}
            className={`px-4 py-2 rounded ${tab === 'saved' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Saved
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && listToRender.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {tab === 'posts' ? 'No posts yet' : 'No saved posts'}
            </h3>
            <p className="text-gray-600 mb-6">
              {tab === 'posts' ? "Start writing your first post!" : "Save posts while browsing to see them here."}
            </p>
            {tab === 'posts' && (
              <Link
                to="/create-post"
                className="inline-flex items-center px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
              >
                Create Post
              </Link>
            )}
          </div>
        )}

        {/* Posts Grid */}
        {!loading && listToRender.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2">
            {listToRender.map((post) => (
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
                      to={`/posts/${post._1d || post._id}`}
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
