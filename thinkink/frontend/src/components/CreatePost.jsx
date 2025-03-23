import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/api";
import AuthContext from "../context/AuthContext"; // ✅ Correct import

const CreatePost = () => {
  const { user } = useContext(AuthContext); // ✅ Now this won't be undefined
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    return <h2 className="text-center mt-10">LOGIN KARO JAAKE BEEECH</h2>;
  }

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    setLoading(true);
    try {
      await createPost(formData, user.token);
      alert("Post created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Content</label>
          <textarea
            className="w-full p-2 border rounded"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Image (Optional)</label>
          <input
            type="file"
            className="w-full p-2 border rounded"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <button
          type="submit"
          className={`w-full p-2 bg-blue-500 text-white rounded ${loading && "opacity-70 cursor-not-allowed"}`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
