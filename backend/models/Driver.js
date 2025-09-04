 import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    licenseNumber: { type: String, required: true, unique: true },
    assignedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  },
  {
    timestamps: true,
    id: false, // ✅ prevent extra id
  }
);

const Driver = mongoose.model("Driver", driverSchema);
export default Driver;
