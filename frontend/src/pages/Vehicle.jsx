import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Plus, Trash2, ArrowLeft } from "lucide-react";

const Vehicle = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [vehicles, setVehicles] = useState([
    {
      id: "1",
      registrationNumber: "DL01AB1234",
      vehicleType: "Car",
      owner: "John Doe",
      model: "Honda City",
      year: "2022",
    },
    {
      id: "2",
      registrationNumber: "MH02CD5678",
      vehicleType: "Motorcycle",
      owner: "Jane Smith",
      model: "Hero Splendor",
      year: "2021",
    },
  ]);

  const [formData, setFormData] = useState({
    registrationNumber: "",
    vehicleType: "",
    owner: "",
    model: "",
    year: "",
  });

  const accent = {
    blue: {
      border: "hover:border-blue-500/60",
      shadow: "hover:shadow-blue-500/20",
      bg: "bg-blue-500/10 border-blue-500/30",
      text: "text-blue-400",
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVehicle = { id: Date.now().toString(), ...formData };
    setVehicles([...vehicles, newVehicle]);
    setFormData({
      registrationNumber: "",
      vehicleType: "",
      owner: "",
      model: "",
      year: "",
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setVehicles(vehicles.filter((v) => v.id !== id));
  };

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
        <h1 className="text-3xl font-bold">Vehicle Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          Register Vehicle
        </button>
      </div>

      {/* Register Form */}
      {showForm && (
        <div className="bg-gray-800/60 border border-gray-700 backdrop-blur-xl rounded-2xl p-6 mb-8 shadow-lg transition">
          <h2 className="text-xl font-semibold mb-4">Register New Vehicle</h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Registration Number"
              value={formData.registrationNumber}
              onChange={(e) =>
                setFormData({ ...formData, registrationNumber: e.target.value })
              }
              className="p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Vehicle Type"
              value={formData.vehicleType}
              onChange={(e) =>
                setFormData({ ...formData, vehicleType: e.target.value })
              }
              className="p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Owner Name"
              value={formData.owner}
              onChange={(e) =>
                setFormData({ ...formData, owner: e.target.value })
              }
              className="p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Model"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              className="p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Year"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              className="p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
            <div className="flex gap-4 md:col-span-2 mt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-500 p-2 rounded-lg shadow-md transition"
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 p-2 rounded-lg shadow-md transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vehicle Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.length === 0 && (
          <div className="text-center col-span-full p-8 bg-gray-800/50 rounded-2xl shadow-md">
            <p>No Vehicles Registered</p>
          </div>
        )}
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className={`group cursor-pointer relative rounded-2xl p-6 bg-gray-900/60 border border-gray-800 backdrop-blur-xl 
              transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-blue-500/20`}
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`flex items-center justify-center w-14 h-14 rounded-xl ${accent.blue.bg} mb-4`}
              >
                <Car className={`w-6 h-6 ${accent.blue.text}`} />
              </div>
              <button
                onClick={() => handleDelete(vehicle.id)}
                className="absolute top-4 right-4 p-1 hover:bg-red-600 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4 text-red-400 group-hover:text-white" />
              </button>
            </div>
            <h3 className="text-xl font-semibold mb-1 text-white">
              {vehicle.registrationNumber}
            </h3>
            <p className="text-gray-300 mb-1">{vehicle.model}</p>
            <p className="text-sm text-gray-400">
              <span className="font-medium">Owner:</span> {vehicle.owner}
            </p>
            <p className="text-sm text-gray-400">
              <span className="font-medium">Year:</span> {vehicle.year}
            </p>
            <span className="inline-block mt-3 px-3 py-1 text-xs font-medium rounded-full bg-blue-600/20 group-hover:bg-blue-600 group-hover:text-white transition">
              {vehicle.vehicleType}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vehicle;
