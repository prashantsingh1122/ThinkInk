import axios from "axios";

const API_URL =  import.meta.env.VITE_API_URL ||"http://localhost:5000/api/auth";

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
export const createPost = async (postData) => {
  const token = localStorage.getItem("token"); // Retrieve token for authorization
  const config = {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  const response = await axios.post(`${API_URL}/posts`, postData, config);
  return response.data;
};