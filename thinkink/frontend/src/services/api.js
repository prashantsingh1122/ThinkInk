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

// ✅ Update a post by ID
export const updatePost = async (id, updatedData) => {
  const token =localStorage.getItem("token");

    const response = await axios.put(
      `http://192.168.1.4:5000/api/posts/${id}`,
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

      const response = await axios.get("http://192.168.1.4:5000/api/posts/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if response has data and posts
      if (!response.data) {
        throw new Error("No data received from server");
      }

      // Handle the new response format
      const posts = response.data.success ? response.data.posts : [];
      return posts;

    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Server responded with error:", error.response.data);
        throw new Error(error.response.data.message || "Failed to fetch posts");
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        throw new Error("No response from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
        throw error;
      }
    }
  };


  // ✅ Delete a post by ID
  export const deletePost = async (postId) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`http://192.168.1.4:5000/api/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
  
  