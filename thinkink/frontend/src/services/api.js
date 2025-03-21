import axios from "axios";

const API_BASE_URL =  "http://localhost:5000/api/posts"; // Corrected URL
// ✅ Signup function
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData, {
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
    const response = await axios.post(`${API_URL}/login`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || "Login failed" };
  }
};

// ✅Create a new blog post
// Create Post
export const createPost = async (postData, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/`, // Ensure this matches your backend route
      postData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure you're sending token for protected routes
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating post: ", error);
    throw error;
  }
};