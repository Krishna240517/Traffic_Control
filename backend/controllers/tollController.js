import Toll from "../models/Toll.js";

// @desc   Add a new toll
// @route  POST /api/tolls
export const addToll = async (req, res) => {
  try {
    const { location } = req.body;
    if (!Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      return res.status(400).json({ success: false, message: "Location must be [lng, lat]" });
    }

    const toll = new Toll({ location });
    await toll.save();

    res.status(201).json({ success: true, message: "Toll added", toll });
  } catch (error) {
    console.error("Error in addToll controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// @desc   Update toll details
// @route  PUT /api/tolls/:tollId
export const updateToll = async (req, res) => {
  try {
    const { tollId: id } = req.params;
    const { location, vehicleTypeCharges, congestionLevel } = req.body;
    const updateData = { updatedAt: Date.now() };

    if (location?.coordinates && location.type === "Point") updateData.location = location;
    if (typeof congestionLevel === "number") updateData.congestionLevel = congestionLevel;
    if (vehicleTypeCharges) updateData.vehicleTypeCharges = { ...vehicleTypeCharges };

    const toll = await Toll.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!toll) return res.status(404).json({ success: false, message: "Toll not found" });

    res.status(200).json({ success: true, message: "Toll updated", toll });
  } catch (error) {
    console.error("Error in updateToll controller:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc   Delete a toll
// @route  DELETE /api/tolls/:tollId
export const deleteToll = async (req, res) => {
  try {
    const { tollId: id } = req.params;
    const toll = await Toll.findByIdAndDelete(id);
    if (!toll) return res.status(404).json({ success: false, message: "Toll not found" });

    res.status(200).json({ success: true, message: "Toll deleted successfully" });
  } catch (error) {
    console.error("Error in deleteToll controller:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc   Get tolls along a route
// @route  GET /api/tolls/route
export const getTollsAlongRoute = async (req, res) => {
  try {
    const { startLat, startLng, endLat, endLng, radius = 5, vehicleType } = req.query;

    if (!startLat || !startLng || !endLat || !endLng) {
      return res.status(400).json({ success: false, message: "Start and end coordinates required" });
    }

    const start = [parseFloat(startLng), parseFloat(startLat)];
    const end = [parseFloat(endLng), parseFloat(endLat)];
    const maxDistance = parseFloat(radius) * 1000; // meters

    const midPoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
    const distanceBetween = getDistanceKm(start, end) * 1000;

    let tolls = await Toll.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: midPoint },
          distanceField: "distanceFromQuery",
          maxDistance: maxDistance + distanceBetween / 2,
          spherical: true,
        },
      },
      {
        $addFields: {
          distanceFromStart: {
            $function: {
              body: function (coord, startCoord) {
                const R = 6371;
                const [lon1, lat1] = startCoord;
                const [lon2, lat2] = coord;
                const dLat = ((lat2 - lat1) * Math.PI) / 180;
                const dLon = ((lon2 - lon1) * Math.PI) / 180;
                const a =
                  Math.sin(dLat / 2) ** 2 +
                  Math.cos((lat1 * Math.PI) / 180) *
                    Math.cos((lat2 * Math.PI) / 180) *
                    Math.sin(dLon / 2) ** 2;
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return R * c;
              },
              args: ["$location.coordinates", start],
              lang: "js",
            },
          },
        },
      },
      { $sort: { distanceFromStart: 1 } },
    ]);

    if (vehicleType) {
      tolls = tolls.filter((toll) => toll.vehicleTypeCharges?.[vehicleType]);
    }

    res.status(200).json({ success: true, tolls });
  } catch (error) {
    console.error("Error in getTollsAlongRoute controller:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// @desc   Get specific toll details
// @route  GET /api/tolls/:tollId
export const getSpecificTollDetails = async (req, res) => {
  try {
    const { tollId: id } = req.params;
    const toll = await Toll.findById(id).lean();
    if (!toll) return res.status(404).json({ success: false, message: "Toll not found" });

    res.status(200).json({ success: true, toll });
  } catch (error) {
    console.error("Error in getSpecificTollDetails controller:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Haversine formula helper
function getDistanceKm(coord1, coord2) {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
