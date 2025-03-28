import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { createPost } from "../services/api";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Title and content are required!");
      return;
    }

    const postData = { title, content, image };

    try {
      const res = await createPost(postData, token);
      console.log("✅ Post created successfully:", res);
      alert("Post created successfully!");
    } catch (error) {
      console.error("❌ Error creating post:", error);
      alert("Error creating post. Please try again.");
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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
