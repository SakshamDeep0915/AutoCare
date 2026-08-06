const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

// Add Vehicle
router.post("/", authMiddleware, addVehicle);

// Get All Vehicles of Logged-in User
router.get("/", authMiddleware, getVehicles);

// Get Single Vehicle
router.get("/:id", authMiddleware, getVehicleById);

// Update Vehicle
router.put("/:id", authMiddleware, updateVehicle);

// Delete Vehicle
router.delete("/:id", authMiddleware, deleteVehicle);

module.exports = router;