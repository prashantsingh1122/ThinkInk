import { Navigate, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  // ✅ Wait for user state to load before deciding
  useEffect(() => {
    if (token !== null) {
      setLoading(false);
    }
  }, [token]);

  console.log("🔒 Checking ProtectedRoute -> User:", user, "Token:", token);

  if (loading) return <p>Loading...</p>; // ✅ Prevents flickering issues

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
