import { useNavigate } from "react-router-dom";
import { Car, Receipt, MapPin, CreditCard } from "lucide-react";

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Vehicle Management",
      description:
        "Register and manage your vehicles. View all registered vehicles in your account.",
      icon: Car,
      path: "/features/vehicles",
      accent: "blue",
    },
    {
      title: "Fine Management",
      description:
        "Check traffic fines, pay outstanding fines, and view fine history by username.",
      icon: Receipt,
      path: "/features/fines",
      accent: "violet",
    },
    {
      title: "Toll Calculator",
      description:
        "Calculate tolls between locations on an interactive map. Get detailed toll information.",
      icon: MapPin,
      path: "/features/toll",
      accent: "cyan",
    },
    {
      title: "Transaction History",
      description:
        "View all your transactions including toll payments, fine payments, and more.",
      icon: CreditCard,
      path: "/features/transactions",
      accent: "emerald",
    },
  ];

  const accentClasses = {
    blue: {
      border: "hover:border-blue-500/60",
      shadow: "hover:shadow-blue-500/20",
      bg: "bg-blue-500/10 border-blue-500/30",
      text: "text-blue-400",
    },
    violet: {
      border: "hover:border-violet-500/60",
      shadow: "hover:shadow-violet-500/20",
      bg: "bg-violet-500/10 border-violet-500/30",
      text: "text-violet-400",
    },
    cyan: {
      border: "hover:border-cyan-500/60",
      shadow: "hover:shadow-cyan-500/20",
      bg: "bg-cyan-500/10 border-cyan-500/30",
      text: "text-cyan-400",
    },
    emerald: {
      border: "hover:border-emerald-500/60",
      shadow: "hover:shadow-emerald-500/20",
      bg: "bg-emerald-500/10 border-emerald-500/30",
      text: "text-emerald-400",
    },
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Smart Traffic Management System
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            AI-powered traffic solutions for safer roads and smarter
            transportation
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            const accent = accentClasses[feature.accent];

            return (
              <div
                key={feature.path}
                onClick={() => navigate(feature.path)}
                className={`group cursor-pointer relative rounded-2xl p-6 
                  bg-gray-900/60 border border-gray-800 backdrop-blur-xl
                  transition-all duration-300 ${accent.border} ${accent.shadow} hover:-translate-y-1 hover:scale-105`}
              >
                {/* Icon */}
                <div
                  className={`flex items-center justify-center w-14 h-14 rounded-xl 
                    ${accent.bg} mb-4 group-hover:scale-105 transition-transform`}
                >
                  <Icon className={`w-7 h-7 ${accent.text}`} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;