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
      <h1 className="text-3xl font-bold">Welcome, {user?.name || "User"}!</h1>
      <button
        onClick={() => navigate("/create-post")}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create New Post
      </button>
    </div>
  );
};

export default Dashboard;
