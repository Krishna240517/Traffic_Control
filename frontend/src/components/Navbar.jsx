import { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Car, Menu, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Features", path: "/features" },
    { name: "Analytics", path: "/analytics" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 shadow-lg"
      role="navigation"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center shadow-md shadow-blue-500/40 transition-transform transform hover:scale-110">
              <Car className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xl font-bold text-white tracking-wide">
              SmartMobility
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ name, path }) => (
              <Link
                key={path}
                to={path}
                className={`text-sm font-medium transition-all duration-200 ${
                  location.pathname === path
                    ? "text-blue-400 scale-105"
                    : "text-gray-300 hover:text-white hover:scale-105"
                }`}
              >
                {name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          {!user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-all hover:scale-105"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 text-sm font-medium text-black bg-white/90 rounded-lg hover:bg-white transition-all hover:scale-105 shadow-md shadow-white/20"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <button
              onClick={logout}
              className="hidden md:block px-4 py-1.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all hover:scale-105 shadow-md shadow-red-500/30"
            >
              Log out
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden border-t border-gray-800 bg-gray-900/70 backdrop-blur-lg rounded-b-xl shadow-lg shadow-black/40 transition-all duration-300 ${
            isMenuOpen
              ? "max-h-96 opacity-100 py-4"
              : "max-h-0 opacity-0 py-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col gap-4 px-2">
            {navLinks.map(({ name, path }) => (
              <Link
                key={path}
                to={path}
                className={`text-sm font-medium transition-all duration-200 ${
                  location.pathname === path
                    ? "text-blue-400 scale-105"
                    : "text-gray-300 hover:text-white hover:scale-105"
                }`}
              >
                {name}
              </Link>
            ))}

            {!user ? (
              <div className="flex gap-3 pt-2">
                <Link
                  to="/login"
                  className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-all hover:scale-105 text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex-1 px-4 py-1.5 text-sm font-medium text-black bg-white/90 rounded-lg hover:bg-white transition-all hover:scale-105 text-center shadow-md shadow-white/20"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <button
                onClick={logout}
                className="w-full px-4 py-1.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all hover:scale-105 shadow-md shadow-red-500/30 mt-2"
              >
                Log out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
