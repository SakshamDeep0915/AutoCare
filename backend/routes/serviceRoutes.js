const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

// Vehicle Service Routes
router.post("/vehicle/:vehicleId", authMiddleware, addService);
router.get("/vehicle/:vehicleId", authMiddleware, getServices);

// Single Service Routes
router.get("/:id", authMiddleware, getServiceById);
router.put("/:id", authMiddleware, updateService);
router.delete("/:id", authMiddleware, deleteService);

module.exports = router;