import axios from "axios";
import config from '../config';
axios.defaults.withCredentials = true;


const API_BASE_URL = `${config.apiUrl}/auth`;
const POSTS_BASE_URL = `${config.apiUrl}/posts`;

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
      POSTS_BASE_URL,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
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
  const response = await axios.get(POSTS_BASE_URL);
  return response.data;
};

// ✅ Get a post by ID
export const getPost = async (id) => {
  try {
    const response = await axios.get(`${POSTS_BASE_URL}/${id}`);
    return response;
  } catch (err) {
    console.error("Failed to fetch post:", err);
    throw err;
  }
};

// ✅ Update a post by ID
export const updatePost = async (id, updatedData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `${POSTS_BASE_URL}/${id}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getUserPosts = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(`${POSTS_BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) {
      throw new Error("No data received from server");
    }

    const posts = response.data.success ? response.data.posts : [];
    return posts;

  } catch (error) {
    if (error.response) {
      console.error("Server responded with error:", error.response.data);
      throw new Error(error.response.data.message || "Failed to fetch posts");
    } else if (error.request) {
      console.error("No response received:", error.request);
      throw new Error("No response from server");
    } else {
      console.error("Error setting up request:", error.message);
      throw error;
    }
  }
};

// ✅ Delete a post by ID
export const deletePost = async (postId) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${POSTS_BASE_URL}/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
  
  