const API_BASE_URL = "http://localhost:5000/api/auth";

export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    return await response.json();
  } catch (error) {
    console.error("Signup Error:", error);
    return { error: "Something went wrong" };
  }
};
