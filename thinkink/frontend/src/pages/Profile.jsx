import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserPosts = async () => {
    console.log("🔄 Attempting to fetch user posts");
    try {
      const res = await axios.get("http://192.168.1.4:5000/api/posts/me", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log("✅ Fetched user posts:", res.data);
      setPosts(Array.isArray(res.data) ? res.data : res.data.posts || []);
    } catch (err) {
      console.error("❌ Failed to fetch user posts:", err);
      setPosts([]);
    } finally {
      console.log("✅ Finished loading user posts");
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (user?.token) {
      console.log("User in Profile useEffect:", user);

      fetchUserPosts();
    }
  }, [user]);
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Blog Posts</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-center">No posts found. Go write something awesome!</p>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {post.content}
                </p>
                <Link
                  to={`/post/${post._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
