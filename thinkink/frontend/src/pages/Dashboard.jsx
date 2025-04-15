import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PostsList from "../components/PostsList";

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

  return  (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Welcome to the Blog!</h2>
      <PostsList />
    </div>
      <Link to="/create-post">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          ➕ Create New Post
        </button>
      </Link>
    </div>
  );
};

export default Dashboard;
