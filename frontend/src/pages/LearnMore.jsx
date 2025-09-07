import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, ShieldCheck, Activity, Globe, Cpu } from "lucide-react";

const LearnMore = () => {
  const navigate = useNavigate();

  const topics = [
    {
      title: "AI-Powered Traffic Analysis",
      description:
        "Our system uses advanced AI algorithms to predict traffic congestion and optimize routes for faster and safer travel.",
      icon: Cpu,
      color: "bg-blue-500/10 text-blue-400",
    },
    {
      title: "Fine & Toll Automation",
      description:
        "Automated detection and management of traffic violations and toll payments ensure transparency and save time for users.",
      icon: Activity,
      color: "bg-cyan-500/10 text-cyan-400",
    },
    {
      title: "Vehicle & Registration Management",
      description:
        "Easily register, manage, and track all your vehicles in one place with complete control over records and documentation.",
      icon: ShieldCheck,
      color: "bg-emerald-500/10 text-emerald-400",
    },
    {
      title: "Smart Maps & Navigation",
      description:
        "Interactive maps with real-time traffic updates guide drivers along the most efficient routes while avoiding delays.",
      icon: Globe,
      color: "bg-violet-500/10 text-violet-400",
    },
    {
      title: "Data Security & Privacy",
      description:
        "We prioritize user data security using end-to-end encryption and comply with privacy standards to protect your information.",
      icon: Info,
      color: "bg-yellow-500/10 text-yellow-400",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white py-16 px-6 md:px-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <button
          onClick={() => navigate("/features")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/60 hover:bg-gray-800 rounded-lg shadow-md transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Features
        </button>
      </div>

      <p className="text-gray-400 max-w-3xl mx-auto text-center mb-16">
        Explore the key features, technologies, and innovations behind our Smart Traffic Management System. 
        Designed to make roads safer, journeys faster, and city traffic smarter.
      </p>

      {/* Topics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {topics.map((topic, idx) => {
          const Icon = topic.icon;
          return (
            <div
              key={idx}
              className={`group cursor-pointer p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-xl hover:-translate-y-1 hover:scale-105 hover:shadow-${topic.color.split(" ")[1]}/30 transition-all`}
            >
              <div className={`flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${topic.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{topic.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300">
                {topic.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Experience Smart Traffic?</h2>
        <p className="text-gray-400 mb-6">Join now and make your journeys faster, safer, and smarter.</p>
        <button
          onClick={() => navigate("/register")}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold text-white shadow-lg hover:scale-105 transition"
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default LearnMore;