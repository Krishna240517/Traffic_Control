 import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
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

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: [0, 0],
      },
    },

    // Trip details (from traffic.json)
    route: { type: String },
    state: { type: String },
    distance: { type: Number }, // km
    duration: { type: Number }, // minutes
    speed: { type: Number, default: 0 }, // avg_speed_kmh
    behaviorClass: { type: Number },
    behaviorLabel: { type: String },
    sensorFeatures: [{ type: Number }],
    safetyScore: { type: Number, default: 0 },
    grade: { type: String, enum: ["A", "B", "C", "D", "F"], default: "F" },
    weather: { type: String },
    timeOfDay: { type: String, enum: ["morning", "afternoon", "evening", "night"] },
    trafficDensity: { type: String, enum: ["low", "medium", "high"] },
    accidentRisk: { type: Number, default: 0 },

    congestionLevel: { type: Number, default: 0 },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

trackingSchema.index({ location: "2dsphere" });

trackingSchema.virtual("lat").get(function () {
  return this.location.coordinates[1];
});

trackingSchema.virtual("lng").get(function () {
  return this.location.coordinates[0];
});

const Tracking = mongoose.model("Tracking", trackingSchema);
export default Tracking;
