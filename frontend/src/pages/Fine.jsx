import { useState } from "react";
import { ArrowLeft, CreditCard, Search, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Fine = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [fines, setFines] = useState([
    {
      id: "1",
      registrationNumber: "DL01AB1234",
      fineType: "Overspeeding",
      amount: 2000,
      location: "Delhi-Gurgaon Expressway",
      date: "2024-01-15",
      status: "pending",
      description: "Speed: 85 km/h in 60 km/h zone",
    },
    {
      id: "2",
      registrationNumber: "MH02CD5678",
      fineType: "Signal Jump",
      amount: 1000,
      location: "Bandra Kurla Complex",
      date: "2024-01-20",
      status: "paid",
      description: "Crossed red signal at 14:32",
    },
    {
      id: "3",
      registrationNumber: "DL01AB1234",
      fineType: "Wrong Lane",
      amount: 500,
      location: "Connaught Place",
      date: "2024-01-22",
      status: "pending",
      description: "Driving in bus lane",
    },
  ]);

  const filteredFines = fines.filter((fine) =>
    fine.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePayFine = (id) => {
    setFines(
      fines.map((fine) =>
        fine.id === id ? { ...fine, status: "paid" } : fine
      )
    );
  };

  const totalPending = filteredFines
    .filter((f) => f.status === "pending")
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 px-6 md:px-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/features")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/60 hover:bg-gray-800 rounded-lg shadow-md transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Features
        </button>
        <h1 className="text-3xl font-bold">Fine Management</h1>
      </div>

      {/* Search */}
      <div className="mb-8 flex gap-4">
        <input
          type="text"
          placeholder="Search by Registration Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={() => {}}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>

      {/* Pending Fines Alert */}
      {totalPending > 0 && (
        <div className="flex items-center gap-4 bg-red-700/20 border border-red-600/30 rounded-2xl p-4 mb-6 shadow-md">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <div>
            <h2 className="font-semibold text-lg">Pending Fines</h2>
            <p>Total outstanding amount: ₹{totalPending.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Fine Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFines.length === 0 && (
          <div className="col-span-full text-center p-8 bg-gray-800/50 rounded-2xl shadow-md">
            <p>No fines found.</p>
          </div>
        )}
        {filteredFines.map((fine) => (
          <div
            key={fine.id}
            className="group relative rounded-2xl p-6 bg-gray-900/60 border border-gray-800 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-blue-500/20"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold">{fine.fineType}</h3>
                <p className="text-gray-400">{fine.registrationNumber}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  fine.status === "paid"
                    ? "bg-green-600/20 text-green-400"
                    : "bg-red-600/20 text-red-400"
                }`}
              >
                {fine.status}
              </span>
            </div>
            <div className="text-sm text-gray-300 mb-2">
              <p>
                <span className="font-medium">Amount:</span> ₹
                {fine.amount.toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Location:</span> {fine.location}
              </p>
              <p>
                <span className="font-medium">Date:</span> {fine.date}
              </p>
            </div>
            <p className="text-gray-400 text-sm mb-4">{fine.description}</p>
            {fine.status === "pending" && (
              <button
                onClick={() => handlePayFine(fine.id)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg shadow-md transition"
              >
                <CreditCard className="w-4 h-4" />
                Pay Fine
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fine;