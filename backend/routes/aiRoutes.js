const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { analyzeVehicle } = require("../controllers/aiController");

router.post(
  "/analyze/:vehicleId",
  authMiddleware,
  analyzeVehicle
);

module.exports = router;