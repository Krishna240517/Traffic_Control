import express from "express";
import { addTrackingData, getLatestTracking } from "../controllers/trackingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addTrackingData);
router.get("/:vehicleId", protect, getLatestTracking);

export default router;
