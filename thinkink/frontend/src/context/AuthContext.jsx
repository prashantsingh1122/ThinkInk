import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        const res = await fetch("http://192.168.1.4:5000/api/auth/me", {

          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("🚨 Failed to fetch user:", res.status);
          setUser(null);
          return;
        }

        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
      }
    };

    fetchUserData();
  }, [token]);

  const loginUser = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
