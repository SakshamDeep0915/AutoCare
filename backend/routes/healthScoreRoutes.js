const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  getVehicleHealthScore,
} = require("../controllers/healthScoreController");


router.get(
  "/:vehicleId",
  authMiddleware,
  getVehicleHealthScore
);


module.exports = router;