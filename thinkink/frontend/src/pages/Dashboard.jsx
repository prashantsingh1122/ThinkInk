import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if not authenticated
    } else {
      // Fetch user details from API (optional)
      setUser({ name: "John Doe" }); // Replace with actual API call
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <h1 className="text-4xl font-bold mb-4 animate-bounce">THINKINK</h1>
      <h2 className="text-2xl font-semibold mb-6">Welcome, {user?.name || "User"}!</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-2">Settings</h3>
          <p className="text-gray-600">Manage your account settings.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-2">Notifications</h3>
          <p className="text-gray-600">Check your recent notifications.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-2">Messages</h3>
          <p className="text-gray-600">Read and send messages.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-2">Analytics</h3>
          <p className="text-gray-600">View your activity analytics.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-2">Support</h3>
          <p className="text-gray-600">Get help and support.</p>
        </div>
      </div>
    </div>
  );
};

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

export default Dashboard;
