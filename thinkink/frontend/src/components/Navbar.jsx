import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, token } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const hideNavbarRoutes = ["/login", "/signup","/dashbo"];
  if (hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'backdrop-blur-lg bg-gray-900/90 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 py-2.5">
        <div className="flex justify-between items-center max-w-[1920px] mx-auto">
          <Link
            to="/"
            className="text-xl font-bold text-white hover:opacity-80 transition-opacity"
          >
            THINKINK
          </Link>

          <div className="flex items-center space-x-8">
            
             

            {token ? (
              <div className="flex items-center space-x-6">
                
                
                <Link
                  to="/profile"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Profile
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="px-5 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition-colors"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
