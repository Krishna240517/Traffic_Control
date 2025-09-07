import { useState, useContext } from "react"; 
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      login(data);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 relative overflow-hidden">
      {/* Decorative blurred circles (background aesthetic) */}
      <div className="absolute top-20 left-20 w-60 h-60 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10 bg-white/20 backdrop-blur-2xl p-10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] w-full max-w-md border border-white/40 hover:border-blue-300/40 transition-all hover:shadow-[0_8px_40px_rgba(59,130,246,0.3)]">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-blue-800 tracking-tight drop-shadow-sm">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center font-medium animate-pulse">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900/80">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-white/40 rounded-xl px-4 py-3 bg-white/10 text-gray-900/90 placeholder-gray-600/70 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all shadow-sm hover:shadow-md hover:bg-white/20 backdrop-blur-sm"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900/80">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-white/40 rounded-xl px-4 py-3 bg-white/10 text-gray-900/90 placeholder-gray-600/70 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all shadow-sm hover:shadow-md hover:bg-white/20 backdrop-blur-sm"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-semibold tracking-wide shadow-md transform transition-all border border-white/40 backdrop-blur-sm ${
              loading
                ? "bg-blue-400/50 text-white/70 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500/50 to-blue-700/50 text-white hover:scale-[1.03] hover:shadow-lg hover:border-blue-300/50"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-800/80 mt-8 text-center">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-700 font-bold hover:underline hover:text-blue-900 transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}