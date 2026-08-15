const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    getVehicleHealthAlerts,
} = require("../controllers/alertController");

router.get(
    "/vehicle-health",
    authMiddleware,
    getVehicleHealthAlerts
);

module.exports = router;