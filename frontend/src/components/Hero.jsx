import { ArrowRight, Zap, Shield, Activity, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // ✅ import context
import heroImage from "../assets/hero.jpg";

// ✅ Simple Badge component
const Badge = ({ children, className = "" }) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${className}`}
    >
      {children}
    </span>
  );
};

// ✅ Simple Button component
const Button = ({ children, size = "md", className = "" }) => {
  const base = "inline-flex items-center justify-center font-semibold rounded-2xl transition";

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button className={`${base} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
};

const Hero = () => {
  const { user } = useContext(AuthContext); // ✅ check login state

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Smart Mobility Device Dashboard"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Floating Neon Glow */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-blue-500/20 blur-3xl animate-pulse opacity-30" />
      <div
        className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-blue-400/20 blur-3xl animate-pulse opacity-30"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <div className="animate-slide-up">
          <Badge className="mb-6 bg-blue-900/20 text-blue-400 border-blue-700/30">
            <Zap className="w-4 h-4 mr-2" />
            Next-Gen Traffic Intelligence
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
            Smart Mobility
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              Revolution
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transforming transportation with AI-driven traffic management,
            real-time monitoring, and intelligent safety systems for every
            vehicle.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {!user ? (
              // Show Log in button if not logged in
              <Link to="/login">
                <Button
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-400 text-white shadow-md shadow-blue-500/50 group"
                >
                  Log in
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              // Show Dashboard button if logged in
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-400 text-white shadow-md shadow-blue-500/50 group"
                >
                  Explore Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}

            <Link to="/LearnMore">
              <Button
                size="lg"
                className="bg-gray-800 text-white border border-gray-600 hover:bg-gray-700"
              >
                Learn More
              </Button>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50 text-gray-300">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>AI Safety Monitoring</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50 text-gray-300">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Real-time Analytics</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50 text-gray-300">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Dynamic Tolling</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;