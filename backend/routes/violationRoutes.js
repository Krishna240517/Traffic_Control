// routes/violationRoutes.js
 import express from "express";
import Violation from "../models/Violation.js";

const router = express.Router();

// Get violation type stats
router.get("/stats", async (req, res) => {
  try {
    const stats = await Violation.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json(stats.map(s => ({ type: s._id, count: s.count })));
  } catch (err) {
    console.error("❌ Error fetching violation stats:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
