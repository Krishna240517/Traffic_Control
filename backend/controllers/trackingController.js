 import * as trackingService from "../services/tracking.service.js";
import * as congestionService from "../services/congestion.service.js";
import * as notificationService from "../services/notification.service.js";
import Vehicle from "../models/Vehicle.js";

// @desc   Create new tracking entry for a vehicle
// @route  POST /api/tracking
export const createTracking = async (req, res) => {
  try {
    const { lat, lng, speed } = req.body;
    const userId = req.user._id;

    const vehicle = await Vehicle.findOne({ ownerId: userId });
    if (!vehicle)
      return res.status(404).json({ success: false, message: "No vehicle found for this user" });

    const tracking = await trackingService.saveTracking(vehicle._id, lat, lng, speed);

    await congestionService.updateCongestionFromTracking(tracking);
    await notificationService.checkAndSendAlerts(userId, vehicle._id, tracking);

    res.status(201).json({ success: true, tracking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating tracking", error: error.message });
  }
};

// @desc   Get latest tracking for a vehicle
// @route  GET /api/tracking/:vehicleId
export const getAllTracking = async (req, res) => {
  try {
    const tracking = await trackingService.getLatestTracking(req.params.vehicleId);
    res.json({ success: true, tracking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching vehicle tracking", error: error.message });
  }
};

// @desc   Get nearby vehicles within a radius
// @route  GET /api/tracking/nearby
export const getNearbyVehicles = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    const vehicles = await trackingService.findNearByVehicles(lat, lng, radius);
    res.json({ success: true, vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching nearby vehicles", error: error.message });
  }
};

// @desc   Update congestion level for a toll
// @route  PUT /api/tracking/toll/:tollId
export const updateTollCongestion = async (req, res) => {
  try {
    const toll = await congestionService.updateTollCongestion(req.params.tollId, req.body.level);
    res.json({ success: true, toll });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating congestion", error: error.message });
  }
};

// @desc   Get all congested tolls
// @route  GET /api/tracking/tolls/congested
export const getCongestedTolls = async (req, res) => {
  try {
    const tolls = await congestionService.getCongestedTolls();
    res.json({ success: true, tolls });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching congested tolls", error: error.message });
  }
};
