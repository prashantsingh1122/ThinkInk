import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPost } from "../services/api";  // Import the getPost function from api.js

export default function PostDetail() {
  const { id } = useParams();  // Get the post ID from the URL params
  const [post, setPost] = useState(null);  // State to store post data

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const cleanId = id.trim();  // Remove any extra spaces or newlines
        console.log("Fetching post with ID:", cleanId);  // Debugging log
        const res = await getPost(cleanId);  // Call the API function to fetch the post
        console.log("Post fetched:", res.data);  // Debugging log to check the response
        setPost(res.data);  // Set the post data to state
      } catch (err) {
        console.error("Failed to fetch post:", err);  // Log any errors
      }
    };

    if (id) {
      fetchPost();  // Fetch the post if the ID is available
    }
  }, [id]);  // This effect runs when the `id` changes

  if (!post) return <p>Loading...</p>;  // Show loading state if post data isn't available yet

  return (
    <div>
      <h1 className="text-3xl text-center">{post.title}</h1>
      <p className="text-xl  text-center py-3">{post.content}</p>
      {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover rounded-lg mb-3"
                />
              )}
      {/* Display other post details as needed */}
    </div>
  );
}
