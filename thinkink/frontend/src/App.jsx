import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { MantineProvider } from '@mantine/core';
import { AuthProvider } from "./context/AuthContext";

//for dot variant loader
import { Loader } from '@mantine/core';


// Lazy loading components
const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const Blog = React.lazy(() => import("./pages/Blog"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Navbar = React.lazy(() => import("./components/Navbar"));
const CreatePost = React.lazy(() => import("./components/CreatePost"));
const PostDetail = React.lazy(() => import("./pages/PostDetail"));
const EditPost = React.lazy(() => import("./pages/EditPost"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Demo = React.lazy(() => import("./pages/Demo"));
const DemoPost = React.lazy(() => import("./pages/DemoPost"));
const ProtectedRoute = React.lazy(() => import("./components/ProtectedRoute"));

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
    <MantineProvider theme={{ colorScheme: 'light' }}>
      <Router>
        <AuthProvider>
          <Layout>
            <Suspense fallback={<Loader variant="dots" />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/blog/:id" element={<Blog />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/demo/posts/:id" element={<DemoPost />} />

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
            </Suspense>
          </Layout>
        </AuthProvider>
      </Router>
    </MantineProvider>
  );
}
