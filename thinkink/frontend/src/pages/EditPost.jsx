import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";

export default function PostEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/${id}`);
        const post = res.data;
        if (post.author !== user._id) {
          alert("You are not authorized to edit this post.");
          navigate("/");
        }
        setTitle(post.title);
        setContent(post.content);
      } catch (err) {
        console.error("Error loading post:", err);
        alert("Failed to load post.");
        navigate("/");
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `/api/posts/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Post updated successfully.");
      navigate(`/posts/${id}`);
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Failed to update post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-12 flex justify-center">
      <form
        onSubmit={handleUpdate}
        className="w-full max-w-2xl bg-slate-800 p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4">✏️ Edit Post</h2>

        <label className="block mb-2 text-slate-300">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 bg-slate-700 rounded text-white"
          required
        />

        <label className="block mb-2 text-slate-300">Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-40 p-2 mb-4 bg-slate-700 rounded text-white"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded text-white"
        >
          {loading ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
}
