import mongoose from "mongoose";
import Driver from "../models/Driver.js";
import Vehicle from "../models/Vehicle.js";
import Tracking from "../models/Tracking.js";

// @desc   Add a new driver
// @route  POST /api/drivers
export const addDriver = async (req, res) => {
  try {
    const { name, licenseNumber, assignedVehicle } = req.body;

    if (!name || !licenseNumber || !assignedVehicle) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(assignedVehicle)) {
      return res.status(400).json({ success: false, message: "Invalid vehicle ID" });
    }

    const exists = await Driver.findOne({ licenseNumber });
    if (exists) {
      return res.status(400).json({ success: false, message: "Driver with this license already exists" });
    }

    const driver = new Driver({ name, licenseNumber, assignedVehicle });
    await driver.save();

    res.status(201).json({ success: true, message: "Driver added successfully", driver });
  } catch (error) {
    console.error("Error adding driver:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc   Get all drivers
// @route  GET /api/drivers
export const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find()
      .populate("assignedVehicle", "plateNumber type status")
      .lean();

    res.status(200).json({ success: true, count: drivers.length, drivers });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc   Get single driver
// @route  GET /api/drivers/:id
export const getDriver = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid driver ID" });
    }

    const driver = await Driver.findById(id)
      .populate("assignedVehicle", "plateNumber type status")
      .lean();

    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    res.status(200).json({ success: true, driver });
  } catch (error) {
    console.error("Error fetching driver:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc   Update driver
// @route  PUT /api/drivers/:id
export const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid driver ID" });
    }

    if (updates.assignedVehicle && !mongoose.Types.ObjectId.isValid(updates.assignedVehicle)) {
      return res.status(400).json({ success: false, message: "Invalid vehicle ID" });
    }

    const driver = await Driver.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
      .populate("assignedVehicle", "plateNumber type status");

    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    res.status(200).json({ success: true, message: "Driver updated successfully", driver });
  } catch (error) {
    console.error("Error updating driver:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc   Delete driver
// @route  DELETE /api/drivers/:id
export const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid driver ID" });
    }

    const driver = await Driver.findByIdAndDelete(id);

    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    res.status(200).json({ success: true, message: "Driver deleted successfully" });
  } catch (error) {
    console.error("Error deleting driver:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc   Get driver stats
// @route  GET /api/drivers/:id/stats
export const getDriverStats = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid driver ID" });
    }

    const trips = await Tracking.find({ driver: id });

    if (!trips.length) {
      return res.status(200).json({ success: true, stats: { totalTrips: 0, avgSpeed: 0, avgSafetyScore: 0 } });
    }

    const totalTrips = trips.length;
    const avgSpeed = trips.reduce((sum, t) => sum + (t.speed || 0), 0) / totalTrips;
    const avgSafetyScore = trips.reduce((sum, t) => sum + (t.safetyScore || 0), 0) / totalTrips;

    res.status(200).json({
      success: true,
      stats: {
        totalTrips,
        avgSpeed: Math.round(avgSpeed),
        avgSafetyScore: Math.round(avgSafetyScore),
      },
    });
  } catch (error) {
    console.error("Error fetching driver stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
