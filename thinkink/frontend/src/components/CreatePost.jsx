import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { createPost } from "../services/api";
import ReactQuill from 'react-quill';



const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Get the first file from the input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!title || !content) {
      alert("Title and content are required!");
      setIsLoading(false);
      return;
    }

    // ✅ Create FormData to send the image file
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (image) {
      console.log("Image to be uploaded:", image); // Log the image file
      formData.append("image", image); // Attach image if present
    }

    try {
      const res = await createPost(formData); // Send FormData to the API
      console.log("✅ Post created successfully:", res);
      alert("Post created successfully!");
      // Clear form
      setTitle("");
      setContent("");
      setImage(null);
    } catch (error) {
      console.error("🚨 Create Post Error:", error.message);
      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);
      }
      if (error.request) {
        console.error("Request Data:", error.request);
      }
      alert("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h2 className="create-post-title">Create New Post</h2>
        <form onSubmit={handleSubmit} className="create-post-form">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="create-post-input"
            disabled={isLoading}
          />
          <textarea
            theme="snow"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="create-post-textarea"
            disabled={isLoading}
          />
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="create-post-file-input"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="create-post-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating post...
              </>
            ) : (
              "Create Post"
            )}
          </button>
        </form>
      </div>
      <style jsx>{`
        .create-post-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 2rem;
        }
        
        .create-post-card {
          width: 100%;
          max-width: 800px;
          background: white;
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .create-post-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
        }
        
        .create-post-title {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          color: #333;
          text-align: center;
        }
        
        .create-post-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .create-post-input,
        .create-post-textarea,
        .create-post-file-input {
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }
        
        .create-post-input:focus,
        .create-post-textarea:focus {
          outline: none;
          border-color: #333;
        }
        
        .create-post-textarea {
          min-height: 150px;
          resize: vertical;
        }
        
        .create-post-button {
          background: #000;
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .create-post-button:hover {
          background: #333;
          transform: translateY(-2px);
        }
        
        .create-post-button:active {
          transform: translateY(0);
        }

        .create-post-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default CreatePost;
