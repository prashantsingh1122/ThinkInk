import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { createPost } from "../services/api";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const { token } = useContext(AuthContext);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Get the first file from the input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Title and content are required!");
      return;
    }

    // ✅ Create FormData to send the image file
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image); // Attach image if present

    try {
      const res = await createPost(formData); // Send FormData to the API
      console.log("✅ Post created successfully:", res);
      alert("Post created successfully!");
    } catch (error) {
      console.error("❌ Error creating post:", error);
      alert("Error creating post. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
      />
      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePost;
