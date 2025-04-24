import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Blog from "./pages/Blog";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import CreatePost from "./components/CreatePost";
import { AuthProvider } from "./context/AuthContext";
import PostDetail from "./pages/PostDetail";
import EditPost from "./pages/EditPost";
import Profile from "./pages/Profile"; // Assuming you have a Profile component


const Layout = ({ children }) => {
  const location = useLocation();
  const showNavbar =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/create-post") ||
    location.pathname.startsWith("/posts");

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/blog/:id" element={<Blog />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-post"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:id"
              element={
                <ProtectedRoute>
                  <PostDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:id/edit"
              element={
                <ProtectedRoute>
                  <EditPost />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}
