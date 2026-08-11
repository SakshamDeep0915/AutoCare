const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addFuelExpense,
    getFuelHistory,
    deleteFuelExpense,
} = require("../controllers/fuelController");

//Add fuel
router.post(
    "/",
    authMiddleware,
    addFuelExpense
);

// Get fuel history for vehicle

router.get(
    "/vehicle/:vehicleId",
    authMiddleware,
    getFuelHistory,
);

router.delete(
    "/:id",
    authMiddleware,
    deleteFuelExpense
);

module.exports = router;