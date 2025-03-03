import { useState } from "react";
import { signup } from "../services/api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "", // ✅ Ensure username is included
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signup(formData);
    if (res.error) {
      setError(res.error);
    } else {
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Signup</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
