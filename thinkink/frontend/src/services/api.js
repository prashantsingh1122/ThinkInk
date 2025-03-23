import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth"; // ✅ Correct URL

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
export const createPost = async (postData) => {
  try {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (!token) throw new Error("No auth token found, please login again.");

    const response = await axios.post(
      "http://localhost:5000/api/posts", // Ensure correct API endpoint
      postData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include token
          "Content-Type": "multipart/form-data", // For image uploads
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};