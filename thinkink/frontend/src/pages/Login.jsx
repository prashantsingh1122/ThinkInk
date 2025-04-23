import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import AuthContext from "../context/AuthContext";
import Particles from "./Lightning";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login(formData);

      if (res.error) {
        setError(res.error);
      } else {
        localStorage.setItem("token", res.token);
        loginUser(res.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen w-full bg-gray-900 overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#cccccc"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-sm px-6 py-10 bg-white/5 backdrop-blur-md border border-gray-700 rounded-2xl shadow-lg">
        <h2 className="text-white text-3xl font-semibold text-center mb-6">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <button
            type="submit"
            className="w-full py-2 bg-indigo-500 text-white rounded-md font-medium hover:bg-indigo-600 transition-shadow hover:shadow-xl"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
