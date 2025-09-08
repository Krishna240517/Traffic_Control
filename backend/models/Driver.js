 import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    licenseNumber: { type: String, required: true, unique: true },
    assignedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },

    // ✅ New fields for analytics
    totalTrips: { type: Number, default: 0 },
    avgSafetyScore: { type: Number, default: 0 },
      grade: { type: String, enum: ["A", "B", "C", "D", "F"], default: "F" },

    // Relationship with Wallet
    wallet: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" },

    // To quickly fetch driver’s violations/fines
    violations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Violation" }],
  },
  {
    timestamps: true,
    id: false, // prevent virtual id
  }
);

const Driver = mongoose.model("Driver", driverSchema);
export default Driver;
