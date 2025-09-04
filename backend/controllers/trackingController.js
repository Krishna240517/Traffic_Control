import Tracking from "../models/Tracking.js";

// @desc   Save vehicle tracking data
// @route  POST /api/tracking
export const addTrackingData = async (req, res) => {
  try {
    const { vehicleId, location, speed } = req.body;

    const tracking = await Tracking.create({
      vehicleId,
      location,
      speed,
      timestamp: new Date()
    });

    // Emit update to all connected clients (real-time)
    req.io.emit("vehicleLocationUpdate", {
      vehicleId,
      location,
      speed,
      timestamp: tracking.timestamp
    });

    res.status(201).json(tracking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get latest location of a vehicle
// @route  GET /api/tracking/:vehicleId
export const getLatestTracking = async (req, res) => {
  try {
    const tracking = await Tracking.findOne({ vehicleId: req.params.vehicleId })
      .sort({ timestamp: -1 });

    if (!tracking) return res.status(404).json({ message: "No tracking data found" });

    res.json(tracking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
