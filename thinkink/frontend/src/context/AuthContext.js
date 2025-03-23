const login = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Store token
      }
  
      return response.data;
    } catch (error) {
      return { error: error.response?.data?.error || "Login failed" };
    }
  };
  