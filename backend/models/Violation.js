// backend/models/Violation.js
import mongoose from "mongoose";

const violationSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    type: {
      type: String,
      enum: ["Speeding", "Signal Jump", "No Helmet", "Overspeeding", "Other"],
      required: true,
    },
    fine: {
      type: Number,
      default: 0,
      min: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Violation = mongoose.model("Violation", violationSchema);
export default Violation;
