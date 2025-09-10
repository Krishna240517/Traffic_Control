import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/route", async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: "From and To are required" });
  }

  try {
    const apiKey = process.env.GOOGLE_MAPS_KEY; // from .env in backend
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
      from
    )}&destination=${encodeURIComponent(to)}&mode=driving&key=${apiKey}`;

    const response = await axios.get(url);

    if (response.data.status !== "OK") {
      return res
        .status(500)
        .json({ error: response.data.error_message || response.data.status });
    }

    const routeInfo = response.data.routes[0].legs[0];
    res.json({
      distance: routeInfo.distance.text,
      duration: routeInfo.duration.text,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch route" });
  }
});

export default router;
