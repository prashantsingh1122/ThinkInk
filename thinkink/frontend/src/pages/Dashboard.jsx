import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PostsList from "../components/PostsList";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      // Fetch user details (optional)
      setUser({ name: "CVAM GANgSTER" }); // Replace with API response
    }
  }, [navigate]);

  return (
    <div className="max-w-7xl bg-slate-900 p-2">
      <div className="max-w-5xl mx-auto bg- p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-50">Dashboard</h1>
            {user && (
              <p className="text-white mt-1">👋 Welcome back, {user.name}!</p>
            )}
          </div>

          <Link to="/create-post">
            <button className="bg-orange-50 text-black px-4 py-2 rounded-full hover:bg-blue-700 transition duration-200 shadow">
              ➕ Create Post
            </button>
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">
            📰 Your Posts
          </h2>
          <PostsList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
