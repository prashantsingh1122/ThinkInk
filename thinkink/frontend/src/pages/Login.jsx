import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import AuthContext from "../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  // Inside your login function



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
        console.log("✅ Login Success:", res);


        // ✅ Store token in localStorage manually here
        localStorage.setItem("token", res.token); // Add this line

        // ✅ Call context function to store token
        loginUser(res.token);

        // ✅ Use navigate to redirect to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("❌ Login Error:", error);
      setError("Something went wrong. Please try again.");


    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded-lg shadow-lg w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-3"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}
