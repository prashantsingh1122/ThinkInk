import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to My Blog</h1>
      <p className="text-lg text-gray-600 mb-6">Share your thoughts, explore ideas, and connect with others.</p>

      <div className="flex space-x-4">
        <Link to="/login">
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
