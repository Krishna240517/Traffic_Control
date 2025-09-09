 // backend/models/Tracking.js
import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
  {
    tripId: { type: String, required: true, unique: true }, // unique trip reference
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },

    route: { type: String },
    state: { type: String },

    distanceKm: { type: Number, required: true },
    durationMinutes: { type: Number, required: true },
    avgSpeedKmh: { type: Number },

    sensorFeatures: { type: mongoose.Schema.Types.Mixed }, // flexible JSON
    grade: { type: String, enum: ["A", "B", "C", "D", "E"], default: "C" },
    weather: { type: String },
    timeOfDay: { type: String, enum: ["morning", "afternoon", "evening", "night"] },

    accidentRisk: { type: Number, min: 0, max: 1 }, // probability between 0 and 1
  },
  {
    timestamps: true,
  }
);

const Tracking = mongoose.model("Tracking", trackingSchema);
export default Tracking;
