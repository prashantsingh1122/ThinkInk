import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, token } = useContext(AuthContext);

  console.log("🔒 Checking ProtectedRoute -> User:", user, "Token:", token);

  if (!token) {
    console.log("❌ No Token Found, Redirecting to Login...");
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    console.log("⏳ User data still loading...");
    return <p>Loading...</p>; // Prevents blank screen while fetching user
  }

  console.log("✅ User is authenticated, rendering protected page.");
  return <Outlet />;
};

export default ProtectedRoute;
