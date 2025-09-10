import mongoose from "mongoose";
import Fine from "../models/Fine.js";
import User from "../models/User.js";
// @desc   Issue a new fine
// @route  POST /api/fines
export const issueFine = async (req, res) => {
  try {
    const { vehicleId, ownerId, amount, reason, location } = req.body;

    if (!vehicleId || !ownerId || !amount || !reason || !location?.coordinates) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(vehicleId) || !mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ success: false, message: "Invalid vehicleId or ownerId" });
    }

    if (!Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      return res.status(400).json({ success: false, message: "Location must be [lng, lat]" });
    }

    const fine = new Fine({
      vehicleId,
      ownerId,
      amount,
      reason,
      location: {
        type: "Point",
        coordinates: location.coordinates,
      },
    });

    await fine.save();
    res.status(201).json({ success: true, message: "Fine issued successfully", fine });
  } catch (error) {
    console.error("Error issuing fine:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc   List fines with optional filters
// @route  GET /api/fines
export const listFines = async (req, res) => {
  try {
    const { ownerId, vehicleId, status } = req.query;
    const filter = {};

    if (ownerId) {
      if (!mongoose.Types.ObjectId.isValid(ownerId)) {
        return res.status(400).json({ success: false, message: "Invalid ownerId" });
      }
      filter.ownerId = ownerId;
    }

    if (vehicleId) {
      if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
        return res.status(400).json({ success: false, message: "Invalid vehicleId" });
      }
      filter.vehicleId = vehicleId;
    }

    if (status) {
      if (!["paid", "unpaid"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value" });
      }
      filter.status = status;
    }

    const fines = await Fine.find(filter)
      .populate("ownerId", "name email")
      .populate("vehicleId", "plateNumber obuId type")
      .sort({ issuedAt: -1 })
      .lean();

    res.status(200).json({ success: true, count: fines.length, fines });
  } catch (error) {
    console.error("Error fetching fines:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc   Update a fine
// @route  PUT /api/fines/:fineId
export const updateFine = async (req, res) => {
  try {
    const { fineId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(fineId)) {
      return res.status(400).json({ success: false, message: "Invalid fineId" });
    }

    const updates = req.body;

    if (updates.location?.coordinates) {
      if (!Array.isArray(updates.location.coordinates) || updates.location.coordinates.length !== 2) {
        return res.status(400).json({ success: false, message: "Location must be [lng, lat]" });
      }
      updates.location.type = "Point";
    }

    const fine = await Fine.findByIdAndUpdate(fineId, updates, { new: true, runValidators: true });
    if (!fine) {
      return res.status(404).json({ success: false, message: "Fine not found" });
    }

    res.status(200).json({ success: true, message: "Fine updated successfully", fine });
  } catch (error) {
    console.error("Error updating fine:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyFines = async (req, res) => {
  try {
    const userId = req.user._id;
    const fines = await Fine.find({ driver: userId })
      .populate("vehicle", "plateNumber")
    if (fines.length === 0) return res.status(404).json({ msg: "No fines" });
  } catch (error) {
    console.error("Error in getMyFines controller", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export const payFine = async (req, res) => {
  try {
    const { fineId: id } = req.params;
    const [fine, user] = Promise.all([
      await Fine.findById(id),
      await User.findById(req.user._id)
    ]);
    const fineAmount = fine.amount;
    const userWalletBalance = user.walletBalance;
    if (userWalletBalance < fineAmount) {
      return res.status(401).json({ msg: "Insufficient Balance" });
    }
    user.walletBalance -= fineAmount;


    const newTrans = new Wallet({
      type: "credit",
      amount: fineAmount,
      description: fine.type,
      relatedUser: user._id,
      relatedFine: fine._id,
    });

    await Promise.all([
      newTrans.save(),
      user.save(),
      Fine.findByIdAndDelete(id)
    ]);
    return res.status(200).json({ msg: "Fine paid successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}