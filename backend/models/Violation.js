 import mongoose from "mongoose";

const violationSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    type: { type: String, required: true }, // e.g. "Speeding", "Signal Jump"
    fine: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    id: false,
  }
);

const Violation = mongoose.model("Violation", violationSchema);
export default Violation;
