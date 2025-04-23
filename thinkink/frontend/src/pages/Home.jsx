import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-pink-100 to-purple-200 flex flex-col items-center justify-center text-center px-4 py-10">
      {/* Animated Gradient Blobs */}
      <motion.div
        className="absolute w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse -top-10 -left-10"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse -bottom-10 -right-10"
        animate={{ x: [0, -20, 0], y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

      {/* Content */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-5xl md:text-7xl font-extrabold text-gray-800 mb-2 tracking-tight"
      >
        THINKINK
      </motion.h1>

      <motion.h2
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-xl md:text-2xl font-medium text-gray-700 mb-6"
      >
        Where Words Turn Into Wonder
      </motion.h2>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-md md:text-lg text-gray-600 max-w-xl mb-10"
      >
        Express yourself, read thoughtful pieces, and become part of a growing community of storytellers.
      </motion.p>

      <motion.div
        className="flex space-x-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-lg hover:bg-blue-600 transition"
          >
            Login
          </motion.button>
        </Link>
        <Link to="/signup">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg shadow-lg hover:bg-green-600 transition"
          >
            Sign Up
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
