import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";


const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ name: "CVAM" }); // optional: fetch user info from API
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'backdrop-blur-lg bg-white/90 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 py-2.5">
        <div className="flex justify-between items-center max-w-[1920px] mx-auto">
          <Link
            to="/"  smooth={true} duration={500}
            className="text-xl font-bold text-gray-900 hover:opacity-80 transition-opacity"
          >
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              THINKINK
            </span>
          </Link>

          {user && (
            <div className="flex items-center space-x-6">
              <Link
                to="/profile" smooth={true} duration={500}
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors relative group"
              >
                Profile
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full" />
              </Link>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="px-5 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
              >
                Logout
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
