 // backend/services/tracking.service.js
import Tracking from "../models/Tracking.js";

// Save new trip
export const saveTracking = async (tripData) => {
  const tracking = new Tracking(tripData);
  return await tracking.save();
};

// Get the latest trip for a driver
export const getLatestTracking = async (driverId) => {
  return await Tracking.findOne({ driverId }).sort({ createdAt: -1 });
};

// Find trips by state
export const findTripsByState = async (state) => {
  return await Tracking.find({ state }).sort({ createdAt: -1 });
};

// Find trips by driverId
export const findTripsByDriver = async (driverId) => {
  return await Tracking.find({ driverId }).sort({ createdAt: -1 });
};

// Find trip by tripId
export const findTripByTripId = async (tripId) => {
  return await Tracking.findOne({ tripId });
};
