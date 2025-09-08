 import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    relatedFine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fine",
      default: null,
    },
    relatedToll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Toll",
      default: null,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    transactions: [transactionSchema], // ✅ Transaction history
  },
  {
    timestamps: true,
    id: false,
  }
);

// Index for efficient user wallet lookups
walletSchema.index({ user: 1 });

const Wallet = mongoose.model("Wallet", walletSchema);
export default Wallet;
