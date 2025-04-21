import axios from "axios";

const API_BASE_URL = "http://192.168.1.4:5000/api/auth"; // ✅ Correct URL

// ✅ Signup function
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || "Signup failed" };
  }
};

// ✅ Login function
export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || "Login failed" };
  }
};

// ✅ Create a new blog post
export const createPost = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found, please login again.");

    const response = await axios.post(
      "http://192.168.1.4:5000/api/posts",  // ✅ Correct URL for creating posts",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",  // Important: Tell the server about form-data
          Authorization: `Bearer ${token}`,
          // Do NOT manually set the Content-Type when using FormData
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("🚨 Error creating post:", error.response?.data || error.message);
    throw error;
  }
};




//✅ Get all blog posts
export const getAllPosts = async () => {
  const response = await axios.get("http://192.168.1.4:5000/api/posts");
  return response.data; 
};


// ✅ Get a post by ID


// ✅ Get a post by ID
export const getPost = async (id) => {
  try {
    const response = await axios.get(`http://192.168.1.4:5000/api/posts/${id}`);
    return response;  // Make sure you return the entire response object
  } catch (err) {
    console.error("Failed to fetch post:", err);
    throw err;  // Propagate the error so you can catch it in the component
  }
};




