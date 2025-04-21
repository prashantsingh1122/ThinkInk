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
import PostDetail from "./pages/PostDetail";

export default function App() {
  return (
    <Router> {/* ✅ Wrap Router outside AuthProvider */}
      <AuthProvider> {/* ✅ AuthProvider should be inside Router */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blog/:id" element={<Blog />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/posts/:id" element={<PostDetail />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
