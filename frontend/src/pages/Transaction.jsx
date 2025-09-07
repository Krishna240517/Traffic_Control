import { useState } from "react";
import { ArrowLeft, Download, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Transaction = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const transactions = [
    { id: "1", type: "toll", amount: 120, description: "Mumbai-Pune Expressway Toll", date: "2024-01-25", status: "completed", transactionId: "TXN001234567", vehicleNumber: "MH02CD5678" },
    { id: "2", type: "fine", amount: 2000, description: "Overspeeding Fine - Delhi-Gurgaon Expressway", date: "2024-01-24", status: "completed", transactionId: "TXN001234568", vehicleNumber: "DL01AB1234" },
    { id: "3", type: "toll", amount: 75, description: "Delhi-Gurgaon Toll Plaza", date: "2024-01-23", status: "completed", transactionId: "TXN001234569", vehicleNumber: "DL01AB1234" },
    { id: "4", type: "registration", amount: 500, description: "Vehicle Registration Fee", date: "2024-01-20", status: "completed", transactionId: "TXN001234570", vehicleNumber: "HR26EF9876" },
    { id: "5", type: "fine", amount: 1000, description: "Signal Jump Fine - Bandra Kurla Complex", date: "2024-01-18", status: "pending", transactionId: "TXN001234571", vehicleNumber: "MH02CD5678" },
  ];

  const filteredTransactions = transactions.filter(t => 
    (filterType === "all" || t.type === filterType) && 
    (!dateFilter || t.date.includes(dateFilter))
  );

  const totalAmount = filteredTransactions.filter(t => t.status === "completed").reduce((sum, t) => sum + t.amount, 0);

  const getTypeIcon = (type) => {
    switch(type) {
      case "toll": return "🛣️";
      case "fine": return "⚠️";
      case "registration": return "📋";
      default: return "💳";
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "completed": return "bg-green-500 text-white";
      case "pending": return "bg-yellow-500 text-white";
      case "failed": return "bg-red-500 text-white";
      default: return "bg-gray-400 text-white";
    }
  };

  const downloadReport = () => {
    console.log("Downloading transaction report...");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 px-6 md:px-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/features")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/60 hover:bg-gray-800 rounded-lg shadow-md transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Features
        </button>
        <button
          onClick={downloadReport}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg shadow-md transition"
        >
          <Download className="w-4 h-4" /> Download Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/60 border border-gray-700 backdrop-blur-xl rounded-2xl p-6 mb-8 shadow-lg transition">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Filter className="w-5 h-5"/> Filter Transactions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="toll">Toll Payments</option>
            <option value="fine">Fine Payments</option>
            <option value="registration">Registration Fees</option>
          </select>
          <input
            type="month"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-blue-600/20 rounded-xl text-center">
          <h3 className="font-semibold text-gray-300">Total Spent</h3>
          <p className="text-3xl font-bold text-white">₹{totalAmount.toLocaleString()}</p>
        </div>
        <div className="p-6 bg-cyan-600/20 rounded-xl text-center">
          <h3 className="font-semibold text-gray-300">Transactions</h3>
          <p className="text-3xl font-bold text-white">{filteredTransactions.length}</p>
        </div>
        <div className="p-6 bg-yellow-500/20 rounded-xl text-center">
          <h3 className="font-semibold text-gray-300">Pending</h3>
          <p className="text-3xl font-bold text-yellow-500">
            {filteredTransactions.filter(t => t.status === "pending").length}
          </p>
        </div>
      </div>

      {/* Transaction Cards */}
      <div className="grid md:grid-cols-1 gap-4">
        {filteredTransactions.map(t => (
          <div key={t.id} className="group cursor-pointer p-6 bg-gray-900/60 border border-gray-800 backdrop-blur-xl rounded-2xl hover:-translate-y-1 hover:scale-105 hover:shadow-blue-500/20 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl">{getTypeIcon(t.type)}</div>
                <div className="space-y-1">
                  <h3 className="font-semibold">{t.description}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>ID: {t.transactionId}</span>
                    <span>Date: {t.date}</span>
                    {t.vehicleNumber && <span>Vehicle: {t.vehicleNumber}</span>}
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="text-2xl font-bold">₹{t.amount.toLocaleString()}</div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(t.status)}`}>
                  {t.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <div className="p-12 bg-gray-800/60 border border-gray-700 backdrop-blur-xl rounded-2xl text-center">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-semibold mb-2">No Transactions Found</h3>
          <p className="text-gray-400">No transactions match your current filters. Adjust the filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Transaction;