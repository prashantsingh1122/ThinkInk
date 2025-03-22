import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Fetch user details from API (optional)
      setUser({ name: "John Doe" }); // Replace with actual API call
    }
  }, []);

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-gray-800">THINKINK</Link>
      <div className="flex items-center space-x-4">
        {user ? (
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-gray-800">{user.name}</span>
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          </Link>
        ) : (
          <Link to="/login" className="text-gray-800 hover:text-blue-600">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;