 import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    plateNumber: {
      type: String,
      required: true,
      unique: true, // ✅ plateNumber is unique, not id
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Car", "Truck", "Bike", "Bus", "Other"], // optional enum
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Inactive", "Banned"], // optional enum
    },
  },
  {
    timestamps: true,
    id: false, // ✅ prevents Mongoose from creating a virtual 'id' field
  }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
