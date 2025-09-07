// src/pages/Register.js
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      login(data); // auto login after register
      navigate("/"); // redirect to dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 relative overflow-hidden">
      {/* Background glowing circles for glassy vibe */}
      <div className="absolute top-16 left-24 w-60 h-60 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-16 right-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10 bg-white/20 backdrop-blur-2xl p-10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] w-full max-w-md border border-white/40 hover:border-blue-300/40 transition-all hover:shadow-[0_8px_40px_rgba(59,130,246,0.3)]">
        <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-700 to-indigo-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
          Register
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center font-medium animate-pulse">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900/80">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-white/40 rounded-xl px-4 py-3 bg-white/10 text-gray-900/90 placeholder-gray-600/70 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all shadow-sm hover:shadow-md hover:bg-white/20 backdrop-blur-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900/80">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-white/40 rounded-xl px-4 py-3 bg-white/10 text-gray-900/90 placeholder-gray-600/70 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all shadow-sm hover:shadow-md hover:bg-white/20 backdrop-blur-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900/80">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-white/40 rounded-xl px-4 py-3 bg-white/10 text-gray-900/90 placeholder-gray-600/70 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all shadow-sm hover:shadow-md hover:bg-white/20 backdrop-blur-sm"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-semibold tracking-wide shadow-md transform transition-all border border-white/40 backdrop-blur-sm bg-gradient-to-r from-blue-500/50 to-blue-700/50 text-white hover:scale-[1.03] hover:shadow-lg hover:border-blue-300/50"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-gray-800/80 mt-6 text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-700 font-bold hover:underline hover:text-blue-900 transition-colors"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}