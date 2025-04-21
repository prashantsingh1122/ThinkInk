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
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">📝 Posts</h2>
      {posts.length === 0 ? (
        <p className="text-center">No posts available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {posts.map((post) => (
            <Link
              to={`/posts/${post._id}`}
              key={post._id}
              className="border rounded-lg p-4 shadow bg-white hover:shadow-lg transition duration-200 hover:scale-[1.02]"
            >
              <h3 className="text-xl font-semibold text-gray-800 text-center">{post.title}</h3>
              <p className="text-gray-500 text-sm mb-2 text-center">
                By {post.author?.username || "Unknown"}
              </p>
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              )}
              <p className="text-gray-700">{post.content.slice(0, 100)}...</p>
              <p className="mt-2 text-blue-500 text-sm text-right">Read more →</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsList;
