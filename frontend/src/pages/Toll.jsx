import { useState } from "react";
import { ArrowLeft, MapPin, Navigation, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Toll = () => {
  const navigate = useNavigate();
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [vehicleType, setVehicleType] = useState("Car");
  const [route, setRoute] = useState(null);
  const [selectedToll, setSelectedToll] = useState(null);

  const tollPoints = [
    {
      id: "1",
      name: "Delhi-Gurgaon Toll Plaza",
      location: "NH-8, Gurgaon",
      coordinates: [28.4595, 77.0266],
      rate: 75,
      vehicleType: "Car",
    },
    {
      id: "2",
      name: "Mumbai-Pune Expressway Toll",
      location: "Mumbai-Pune Expressway",
      coordinates: [19.076, 72.8777],
      rate: 120,
      vehicleType: "Car",
    },
    {
      id: "3",
      name: "Bangalore-Mysore Toll",
      location: "NH-275, Karnataka",
      coordinates: [12.9716, 77.5946],
      rate: 90,
      vehicleType: "Car",
    },
  ];

  const accent = {
    blue: {
      border: "hover:border-blue-500/60",
      shadow: "hover:shadow-blue-500/20",
      bg: "bg-blue-500/10 border-blue-500/30",
      text: "text-blue-400",
    },
    cyan: {
      border: "hover:border-cyan-500/60",
      shadow: "hover:shadow-cyan-500/20",
      bg: "bg-cyan-500/10 border-cyan-500/30",
      text: "text-cyan-400",
    },
    green: {
      border: "hover:border-emerald-500/60",
      shadow: "hover:shadow-emerald-500/20",
      bg: "bg-emerald-500/10 border-emerald-500/30",
      text: "text-emerald-400",
    },
  };

  const calculateRoute = () => {
    if (!fromLocation || !toLocation) return;

    const simulatedRoute = {
      from: fromLocation,
      to: toLocation,
      distance: Math.floor(Math.random() * 500) + 50,
      estimatedTime: "3h 45m",
      totalToll: tollPoints.reduce((sum, t) => sum + t.rate, 0),
      tollPoints: tollPoints,
    };
    setRoute(simulatedRoute);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 px-6 md:px-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/features")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/60 hover:bg-gray-800 rounded-lg shadow-md transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Features
        </button>
        <h1 className="text-3xl font-bold">Toll Calculator</h1>
      </div>

      {/* Route Form */}
      <div className="bg-gray-800/60 border border-gray-700 backdrop-blur-xl rounded-2xl p-6 mb-8 shadow-lg transition">
        <h2 className="text-xl font-semibold mb-4">Calculate Toll</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="From Location"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            className="p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="To Location"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            className="p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          >
            <option value="Car">Car</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="Truck">Truck</option>
            <option value="Bus">Bus</option>
          </select>
        </div>
        <button
          onClick={calculateRoute}
          className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 p-2 rounded-lg shadow-md transition"
        >
          <Calculator className="w-4 h-4" /> Calculate
        </button>
      </div>

      {/* Route Info */}
      {route && (
        <div className="grid md:grid-cols-4 gap-6">
          <div className="p-4 bg-blue-600/20 rounded-xl text-center">
            <h3 className="font-semibold">Distance</h3>
            <p className="text-2xl font-bold">{route.distance} km</p>
          </div>
          <div className="p-4 bg-cyan-600/20 rounded-xl text-center">
            <h3 className="font-semibold">Estimated Time</h3>
            <p className="text-2xl font-bold">{route.estimatedTime}</p>
          </div>
          <div className="p-4 bg-emerald-600/20 rounded-xl text-center">
            <h3 className="font-semibold">Total Toll</h3>
            <p className="text-2xl font-bold">₹{route.totalToll}</p>
          </div>
          <div className="p-4 bg-blue-600/20 rounded-xl text-center">
            <h3 className="font-semibold">Toll Points</h3>
            <p className="text-2xl font-bold">{route.tollPoints.length}</p>
          </div>
        </div>
      )}

      {/* Toll Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {tollPoints.map((toll) => (
          <div
            key={toll.id}
            className={`group cursor-pointer relative rounded-2xl p-6 bg-gray-900/60 border border-gray-800 backdrop-blur-xl 
              transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-blue-500/20`}
            onClick={() => setSelectedToll(toll)}
          >
            <div className={`flex items-center justify-center w-14 h-14 rounded-xl ${accent.blue.bg} mb-4`}>
              <MapPin className={`w-6 h-6 ${accent.blue.text}`} />
            </div>
            <h3 className="text-xl font-semibold mb-1">{toll.name}</h3>
            <p className="text-gray-300 mb-1">{toll.location}</p>
            <p className="text-sm text-gray-400">
              <span className="font-medium">Vehicle Type:</span> {toll.vehicleType}
            </p>
            <span className="inline-block mt-3 px-3 py-1 text-xs font-medium rounded-full bg-blue-600/20 group-hover:bg-blue-600 group-hover:text-white transition">
              ₹{toll.rate}
            </span>
          </div>
        ))}
      </div>

      {/* Selected Toll Details */}
      {selectedToll && (
        <div className="bg-gray-800/60 border border-gray-700 backdrop-blur-xl rounded-2xl p-6 mt-8 shadow-lg transition">
          <h2 className="text-xl font-semibold mb-4">Toll Details - {selectedToll.name}</h2>
          <p className="text-gray-300"><span className="font-medium">Location:</span> {selectedToll.location}</p>
          <p className="text-gray-300"><span className="font-medium">Vehicle Type:</span> {selectedToll.vehicleType}</p>
          <p className="text-gray-300"><span className="font-medium">Rate:</span> ₹{selectedToll.rate}</p>
          <p className="text-gray-400 text-sm mt-2">Coordinates: {selectedToll.coordinates[0]}, {selectedToll.coordinates[1]}</p>
        </div>
      )}
    </div>
  );
};

export default Toll;