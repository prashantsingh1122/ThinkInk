import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ name: "CVAM" }); // optional: fetch user info from API
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const hideNavbarRoutes = ["/login", "/signup"];
  if (hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="backdrop-blur-lg bg-gradient-to-r from-slate-900/60 to-slate-800/60 border-b border-white/10 shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link
        to="/"
        className="text-2xl font-extrabold bg-gradient-to-r from-pink-400 to-violet-500 bg-clip-text text-transparent hover:opacity-90 transition duration-200"
      >
        THINKINK
      </Link>

      {user && (
        <div className="flex items-center space-x-6 text-white text-sm font-medium">
          <Link
            to="/dashboard"
            className="hover:text-pink-300 transition duration-200"
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className="hover:text-pink-300 transition duration-200"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-1.5 rounded-full hover:bg-red-600 transition duration-200 text-white font-semibold shadow-sm"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
