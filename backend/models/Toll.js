 import mongoose from "mongoose";

const tollSchema = new mongoose.Schema(
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
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    walletTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet.transactions",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Toll = mongoose.model("Toll", tollSchema);
export default Toll;
