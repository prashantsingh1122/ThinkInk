import { useState, useEffect, useContext, useCallback } from "react";
import { getAllPosts } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthContext from '../context/AuthContext';

// Add smooth scrolling behavior to the entire page
document.documentElement.style.scrollBehavior = 'smooth';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // INFINITE SCROLL STATES - ADDED
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [postsToShow] = useState(5); // Number of posts to load each time
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const filtered = posts.filter(post => {
      const titleMatch = post.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const authorMatch = post.author?.username?.toLowerCase().includes(searchQuery.toLowerCase());
      return titleMatch || authorMatch;
    });
    setFilteredPosts(filtered);
    // RESET INFINITE SCROLL - ADDED
    setCurrentIndex(0);
    setDisplayedPosts([]);
    setHasMore(true);
  }, [searchQuery, posts]);

  // LOAD INITIAL POSTS AND MORE POSTS - ADDED
  useEffect(() => {
    if (filteredPosts.length > 0 && displayedPosts.length === 0) {
      loadMorePosts();
    }
  }, [filteredPosts]);

  const loadMorePosts = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    // Simulate loading delay (remove this in production)
    setTimeout(() => {
      const postsToDisplay = filteredPosts.slice(1); // Skip featured post
      const nextPosts = postsToDisplay.slice(currentIndex, currentIndex + postsToShow);
      
      if (nextPosts.length > 0) {
        setDisplayedPosts(prev => [...prev, ...nextPosts]);
        setCurrentIndex(prev => prev + postsToShow);
        
        // Check if there are more posts
        if (currentIndex + postsToShow >= postsToDisplay.length) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
      
      setIsLoading(false);
    }, 800); // Remove this delay in production
  }, [filteredPosts, currentIndex, postsToShow, isLoading, hasMore]);

  // INFINITE SCROLL DETECTION - ADDED
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMorePosts]);

  const handleCreatePost = (e) => {
    if (!token) {
      e.preventDefault();
      navigate('/login', { state: { from: '/create-post' } });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900 pt-24 pb-12 px-8"
    >
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <motion.h1 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="text-4xl font-bold text-white mb-2"
            >
              <p className="text-gray-300">
                {user?.username ? `Welcome back, ${user.username}!` : 'Welcome to ThinkInk!'}
              </p>
            </motion.h1>
            <motion.h2 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400"
            >
              {user?.username ? 'Share your thoughts with the world!' : 'Join our community and start sharing!'}
            </motion.h2>
          </div>
          
          {/* Create Post Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to={token ? "/create-post" : "/login"}
              onClick={handleCreatePost}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
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
              {token ? "Create Post" : "Sign in to Create Post"}
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
            placeholder="Search for a topic or author"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 bg-gray-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm placeholder:text-gray-400"
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all duration-300">
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
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            Today's Article
            <div className="h-1 w-24 bg-indigo-600 rounded-full ml-4 opacity-20" />
          </h2>
          <motion.div 
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative overflow-hidden rounded-3xl shadow-xl bg-gray-800 group"
          >
            <Link 
              to={filteredPosts[0]?._id ? `/posts/${filteredPosts[0]._id}` : "#"}
              className="block transition-all duration-300 hover:opacity-90"
            >
              <img
                src={filteredPosts[0]?.image || "/placeholder.jpg"}
                alt="Featured"
                className="w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-10">
                  <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-sm mb-4 inline-block font-medium">
                    Featured
                  </span>
                  <h3 className="text-3xl font-bold text-white mb-4">{filteredPosts[0]?.title || "Loading..."}</h3>
                  <p className="text-gray-200 text-lg max-w-3xl">
                    {filteredPosts[0]?.content?.slice(0, 150) + "..." || ""}
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
            <h2 className="text-2xl font-bold text-white flex items-center">
              {searchQuery ? 'Search Results' : 'More Articles'}
              <div className="h-1 w-16 bg-indigo-600 rounded-full ml-4 opacity-20" />
            </h2>
            {/* UPDATED - Show count of displayed posts */}
            
            
            {/*             <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">
                            Showing {displayedPosts.length} of {Math.max(0, filteredPosts.length - 1)} articles
                            </span>
                            </div>    
            */}


          </div>
          
          {/* Articles Grid - UPDATED to use displayedPosts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedPosts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * (index % 5) }} // Stagger animation for new posts
                whileHover={{ y: -4 }}
              >
                <Link
                  to={`/posts/${post._id}`}
                  className="block bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={post.image || "/placeholder.jpg"}
                      alt={post.title}
                      className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gray-900/90 backdrop-blur-sm rounded-full text-sm text-white font-medium">
                      3 min read
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{post.content?.slice(0, 100)}...</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {post.author?.username?.[0] || "U"}
                          </span>
                        </div>
                        <span className="text-sm text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-indigo-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                        Read more →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* LOADING INDICATOR - ADDED */}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-12"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-400">Loading more posts...</span>
              </div>
            </motion.div>
          )}

          {/* END OF POSTS INDICATOR - ADDED */}
          {!hasMore && displayedPosts.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">You've reached the end!</h3>
              <p className="text-gray-400">No more articles to show</p>
            </motion.div>
          )}

          {/* NO RESULTS MESSAGE - UPDATED */}
          {displayedPosts.length === 0 && !isLoading && searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
              <p className="text-gray-400">Try searching with different keywords</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;