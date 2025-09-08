 import Vehicle from "../models/Vehicle.js";
import Tracking from "../models/Tracking.js";

// @desc   Add new vehicle
// @route  POST /api/vehicles
export const addVehicle = async (req, res) => {
  try {
    const { plateNumber, ownerId, type, obuId, status } = req.body;

    // Check if vehicle exists
    const exists = await Vehicle.findOne({ plateNumber });
    if (exists) return res.status(400).json({ message: "Vehicle already exists" });

    const vehicle = await Vehicle.create({ plateNumber, ownerId, type, obuId, status });
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all vehicles (with owner and latest tracking)
// @route  GET /api/vehicles
export const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .populate("ownerId", "name email")
      .lean(); // convert to plain JS object for adding extra fields

    // Attach latest tracking for each vehicle
    for (let v of vehicles) {
      const latestTracking = await Tracking.findOne({ vehicle: v._id })
        .sort({ timestamp: -1 })
        .lean();
      v.latestTracking = latestTracking || null;
    }

    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single vehicle
// @route  GET /api/vehicles/:id
export const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate("ownerId", "name email")
      .lean();
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const latestTracking = await Tracking.findOne({ vehicle: vehicle._id })
      .sort({ timestamp: -1 })
      .lean();
    vehicle.latestTracking = latestTracking || null;

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update vehicle
// @route  PUT /api/vehicles/:id
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete vehicle
// @route  DELETE /api/vehicles/:id
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json({ message: "Vehicle removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
