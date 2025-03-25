import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // ✅ Fetch user data when token is set
  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  // ✅ Function to fetch user data
  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data); // ✅ Store user details in state
      } else {
        logoutUser(); // If token is invalid, log out the user
      }
    } catch (error) {
      console.error("Auth Error:", error);
      logoutUser();
    }
  };

  // ✅ Login function updates both token & user
  const loginUser = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    fetchUserData(); // Fetch user details after setting token
  };

  // ✅ Logout function clears everything
  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
