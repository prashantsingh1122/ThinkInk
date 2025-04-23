import { useState, useEffect } from "react";
import { getAllPosts } from "../services/api";
import { Link } from "react-router-dom";

const PostsList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="p-4 bg-slate-900 rounded-xl shadow-inner">
      <h2 className="text-3xl font-bold mb-8 text-center text-white">📝 Posts</h2>
      {posts.length === 0 ? (
        <p className="text-center text-gray-400">No posts available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {posts.map((post) => (
            <Link
              to={`/posts/${post._id}`}
              key={post._id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg hover:shadow-2xl transform transition-all hover:scale-[1.02]"
            >
              <h3 className="text-2xl font-semibold text-white text-center mb-1">{post.title}</h3>
              <p className="text-gray-400 text-sm mb-3 text-center">
                By {post.author?.username || "Unknown"}
              </p>

              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-lg mb-4 transition-transform duration-300 hover:scale-105"
                />
              )}

              <p className="text-gray-300">{post.content.slice(0, 100)}...</p>
              <p className="mt-3 text-indigo-400 text-sm text-right hover:underline">
                Read more →
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsList;
