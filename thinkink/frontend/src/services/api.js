import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

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
