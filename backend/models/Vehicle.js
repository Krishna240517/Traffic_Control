 import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    plateNumber: {
      type: String, // 🔄 changed to String (real plates are alphanumeric)
      required: true,
      unique: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["Car", "Truck", "Bus", "Bike", "Other"], // ✅ optional enum
    },

    obuId: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["active", "blacklisted", "suspended", "inactive"],
      default: "active",
    },

    // ✅ New fields for analytics
    totalTrips: { type: Number, default: 0 },
    avgSpeed: { type: Number, default: 0 },
    lastKnownLocation: {
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

    lastTrackedAt: { type: Date }, // last timestamp from tracking
  },
  { timestamps: true }
);

// Index for geospatial queries
vehicleSchema.index({ lastKnownLocation: "2dsphere" });

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
