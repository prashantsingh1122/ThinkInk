import { useEffect, useState } from "react";
import { getUserPosts, deletePost } from "../services/api";
import { useNavigate } from "react-router-dom";

document.documentElement.style.scrollBehavior = 'smooth';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getUserPosts();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch user posts:", err);
      }
    };

    fetchPosts();
  }, []);

  const handleEdit = (postId) => {
    navigate(`/posts/${postId}/edit`); // fixed route
  };

  const handleDelete = async (postId) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId);
        setPosts(posts.filter((post) => post._id !== postId));
      } catch (err) {
        console.error("Error deleting post:", err);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">🥰 Your Posts</h1>
      {posts.length === 0 ? (
        <p>No posts yet!</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-md rounded p-4 flex justify-between items-center"
            >
              <div>
                <h2
                  className="text-xl font-semibold text-blue-600 cursor-pointer hover:underline block transition-all duration-300 hover:opacity-90"
                  onClick={() => navigate(`/posts/${post._id}`)} // fixed route
                >
                  {post.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex space-x-4">
                <button onClick={() => handleEdit(post._id)} title="Edit">
                  ✏️
                </button>
                <button onClick={() => handleDelete(post._id)} title="Delete">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
