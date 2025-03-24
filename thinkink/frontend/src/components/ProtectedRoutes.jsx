import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, token } = useContext(AuthContext);

  console.log("🔒 Checking ProtectedRoute -> User:", user, "Token:", token);

  // ✅ Fix: Don't redirect until we are sure user is null
  if (token === null) {
    return null; // Wait until we know user state
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
