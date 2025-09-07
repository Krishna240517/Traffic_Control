// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0b1120] to-[#111827] border-t border-slate-700 mt-12 shadow-inner">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between text-gray-400">
        
        {/* Left Side */}
        <p className="text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-blue-400 hover:text-blue-300 transition">
            Traffic Control
          </span>
          . All rights reserved.
        </p>

        {/* Right Side */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a
            href="#"
            className="hover:text-blue-400 transition-colors duration-200"
          >
            About
          </a>
          <a
            href="#"
            className="hover:text-blue-400 transition-colors duration-200"
          >
            Privacy
          </a>
          <a
            href="#"
            className="hover:text-blue-400 transition-colors duration-200"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}