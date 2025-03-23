import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    console.log("🔄 useEffect triggered, Token:", token);
    if (token) {
      localStorage.setItem("token", token); // Ensure token is always saved
      fetchUserData(token);
    }
  }, [token]);  // ✅ Trigger fetch when token updates

  const fetchUserData = async (token) => {
    try {
      console.log("📡 Fetching user data...");
      const response = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ User Data:", data);
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        console.log("❌ Invalid token, logging out...");
        logoutUser();
      }
    } catch (error) {
      console.error("🚨 Auth Error:", error);
      logoutUser();
    }
  };

  const loginUser = (token) => {
    console.log("🔑 Storing Token:", token);
    setToken(token);
    localStorage.setItem("token", token);
    fetchUserData(token);  // ✅ Immediately fetch user data
  };

  const logoutUser = () => {
    console.log("🚪 Logging out...");
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
