 // backend/controllers/trackingController.js
import Tracking from "../models/Tracking.js";

// @desc   Create a new trip tracking record
// @route  POST /api/tracking
export const createTracking = async (req, res) => {
  try {
    const {
      tripId,
      driverId,
      vehicleId,
      route,
      state,
      distanceKm,
      durationMinutes,
      avgSpeedKmh,
      sensorFeatures,
      grade,
      weather,
      timeOfDay,
      accidentRisk,
    } = req.body;

    const tracking = new Tracking({
      tripId,
      driverId,
      vehicleId,
      route,
      state,
      distanceKm,
      durationMinutes,
      avgSpeedKmh,
      sensorFeatures,
      grade,
      weather,
      timeOfDay,
      accidentRisk,
    });

    await tracking.save();
    res.status(201).json({ success: true, data: tracking });
  } catch (error) {
    console.error("Error creating tracking:", error);
    res.status(500).json({ success: false, message: "Error creating trip", error: error.message });
  }
};

// @desc   Get all trips with optional filters
// @route  GET /api/tracking
export const getAllTracking = async (req, res) => {
  try {
    const { driverId, state } = req.query;
    const filter = {};
    if (driverId) filter.driverId = driverId;
    if (state) filter.state = state;

    const trips = await Tracking.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: trips.length, data: trips });
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ success: false, message: "Error fetching trips", error: error.message });
  }
};

// @desc   Get single trip by Mongo ID
// @route  GET /api/tracking/:id
export const getTrackingById = async (req, res) => {
  try {
    const trip = await Tracking.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });
    res.json({ success: true, data: trip });
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ success: false, message: "Error fetching trip", error: error.message });
  }
};

// @desc   Delete a trip record
// @route  DELETE /api/tracking/:id
export const deleteTracking = async (req, res) => {
  try {
    const trip = await Tracking.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });
    res.json({ success: true, message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ success: false, message: "Error deleting trip", error: error.message });
  }
};
