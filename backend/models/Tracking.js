import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    speed: { type: Number, default: 0 },
    congestionLevel: { type: Number, default: 0 }, // ✅ now available
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    id: false,
  }
);

export default mongoose.model("Tracking", trackingSchema);
