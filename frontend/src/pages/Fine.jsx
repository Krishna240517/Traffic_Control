import { useState, useEffect } from "react";
import { ArrowLeft, CreditCard, Search, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
const token = localStorage.getItem("token");
const Fine = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/violations/my-fines", {
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        });
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        setFines(data);
      } catch (err) {
        console.error("Error fetching fines:", err);
        setFines([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFines();
  }, []);

  const filteredFines = fines.filter((fine) =>
    fine.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePayFine = async (fineId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/violations/pay/${fineId}`,{
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.msg || "Failed to pay fine");
      }
      setFines((prev) => prev.filter((fine) => fine._id !== fineId));
    } catch (err) {
      console.error("Error paying fine:", err);
    }
  };

  const totalPending = filteredFines
    .filter((f) => !f.isPaid)
    .reduce((sum, f) => sum + f.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading fines...
      </div>
    );
  }

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
                onClick={() => handlePayFine(fine._id)}
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
