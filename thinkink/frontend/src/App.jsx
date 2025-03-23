import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Blog from "./pages/Blog";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoutes";
import Navbar from "./components/Navbar";
import CreatePost from "./components/CreatePost";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>   {/* ✅ Wrap everything with AuthProvider */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home Page should load first */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blog/:id" element={<Blog />} />

          {/*  Protected Routes*/}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-post" element={<CreatePost />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
