import { useState } from "react";
import { signup } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import Particles from "./Lightning";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await signup(formData);
      if (res.error) {
        setError(res.error);
      } else {
        localStorage.setItem("token", res.token);
        navigate("/dashboard");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
      {/* Home Link */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 z-20 flex items-center space-x-2 text-white hover:text-purple-400 transition-colors"
      >
        <svg 
          className="w-8 h-8" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
          />
        </svg>
        <span className="text-xl font-semibold">ThinkInk</span>
      </Link>

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
      <div className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-sm rounded-3xl">
        <h2 className="text-4xl font-medium text-white mb-8 text-center">
          Sign Up
        </h2>

        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="w-full px-4 py-3 bg-transparent text-white border-b border-gray-600 focus:border-white transition-colors placeholder-gray-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-3 bg-transparent text-white border-b border-gray-600 focus:border-white transition-colors placeholder-gray-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-3 bg-transparent text-white border-b border-gray-600 focus:border-white transition-colors placeholder-gray-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-500 hover:text-purple-400">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
