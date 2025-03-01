import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Blog from "./pages/Blog";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} /> {/* Home Page should load first */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/blog/:id" element={<Blog />} />
      </Routes>
    </Router>
  );
}
