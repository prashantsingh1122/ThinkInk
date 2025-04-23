import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PostsList from "../components/PostsList";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setUser({ name: "CVAM GANgSTER" }); // Replace later with real API call
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-gray-900 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-3xl px-8 py-10"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📋 Dashboard</h1>
          {user && (
            <p className="text-indigo-200 text-base">
              👋 Welcome back, <span className="font-semibold text-white">{user.name}</span>
            </p>
          )}

          <Link to="/create-post">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 bg-emerald-400 text-black font-medium px-6 py-2 rounded-full shadow-lg hover:bg-emerald-500 transition-all duration-300"
            >
              ➕ Create New Post
            </motion.button>
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">📰 Your Posts</h2>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <PostsList />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
