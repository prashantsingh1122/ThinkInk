import { useState, useEffect } from "react";
import { getAllPosts } from "../services/api";

const PostsList = () => {
    const [posts,setPosts] = useState([]);

    // Fetch posts from the baackend when the componente loads
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
          <h2 className="text-2xl font-bold mb-4">All Posts</h2>
          {posts.length === 0 ? (
            <p>No posts available.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div key={post._id} className="border p-4 rounded shadow">
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover mt-2 rounded"
                    />
                  )}
                  <p className="mt-2">{post.content}</p>
                  <p className="text-gray-500 text-sm">
                    By {post.author?.username || "Unknown"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };
    
    export default PostsList;