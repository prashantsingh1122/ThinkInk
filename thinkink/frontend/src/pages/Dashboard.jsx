import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      <h1 className="text-4xl font-bold mb-4 animate-bounce">THINKINK</h1>
      <h2 className="text-2xl font-semibold mb-6">Welcome, {user?.name || "User"}!</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-2">Profile</h3>
          <p className="text-gray-600">View and edit your profile details.</p>
        </div>
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

export default Dashboard;
