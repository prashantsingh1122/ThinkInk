import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [emal, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const HANDLElOGIN = async (e) => {
        e.preventDefault();
        console.log("Login", { emal, password });
    };
    return (
        <div className="flex items-center justify-center h-screen">
            <form className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold mb-4">Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded mb-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="w-full bg-blue-500 text-white p-2 rounded" type="submit" onClick={handleLogin}>
                    Login
                </button>
            </form>
        </div>
    );
}