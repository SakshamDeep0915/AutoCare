const FuelExpense = require("../models/FuelExpense");
const Vehicle = require("../models/Vehicle");

// =========================
// Add Fuel Expense
// =========================

exports.addFuelExpense = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      vehicle,
      fuelDate,
      fuelType,
      quantity,
      pricePerUnit,
      odometer,
      fuelStation,
      notes,
    } = req.body;

    if (
      !vehicle ||
      !fuelDate ||
      !fuelType ||
      quantity === undefined ||
      pricePerUnit === undefined ||
      odometer === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Check vehicle belongs to logged-in user
    const vehicleExists = await Vehicle.findOne({
      _id: vehicle,
      user: userId,
    });

    if (!vehicleExists) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Calculate total fuel cost
    const totalCost =
      Number(quantity) * Number(pricePerUnit);

    const fuelExpense = await FuelExpense.create({
      vehicle,
      user: userId,
      fuelDate,
      fuelType,
      quantity,
      pricePerUnit,
      totalCost,
      odometer,
      fuelStation,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Fuel expense added successfully",
      fuelExpense,
    });

  } catch (error) {
    console.error("Add Fuel Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// =========================
// Get Fuel History
// =========================

exports.getFuelHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vehicleId } = req.params;

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      user: userId,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    const fuelExpenses = await FuelExpense.find({
      vehicle: vehicleId,
      user: userId,
    }).sort({
      fuelDate: -1,
    });

    res.status(200).json({
      success: true,
      fuelExpenses,
    });

  } catch (error) {
    console.error(
      "Fuel History Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// =========================
// Fuel Efficiency
// =========================

exports.getFuelEfficiency = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vehicleId } = req.params;

    // Check vehicle belongs to logged-in user
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      user: userId,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Get fuel records in chronological order
    const fuelExpenses = await FuelExpense.find({
      vehicle: vehicleId,
      user: userId,
    }).sort({
      odometer: 1,
    });

    // Need at least 2 fuel records
    if (fuelExpenses.length < 2) {
      return res.status(200).json({
        success: true,
        fuelEfficiency: null,
        message:
          "Add at least two fuel records to calculate fuel efficiency.",
      });
    }

    // First and latest odometer readings
    const firstRecord = fuelExpenses[0];
    const latestRecord =
      fuelExpenses[fuelExpenses.length - 1];

    const distance =
      Number(latestRecord.odometer) -
      Number(firstRecord.odometer);

    // Calculate total fuel consumed
    // We use fuel quantities from records after the first reading
    let totalFuel = 0;

    for (let i = 1; i < fuelExpenses.length; i++) {
      totalFuel += Number(
        fuelExpenses[i].quantity
      );
    }

    // Prevent invalid calculation
    if (distance <= 0 || totalFuel <= 0) {
      return res.status(200).json({
        success: true,
        fuelEfficiency: null,
        message:
          "Insufficient or invalid odometer/fuel data.",
      });
    }

    // Calculate km/L
    const fuelEfficiency =
      distance / totalFuel;

    res.status(200).json({
      success: true,

      fuelEfficiency: Number(
        fuelEfficiency.toFixed(2)
      ),

      distance,

      fuelConsumed: Number(
        totalFuel.toFixed(2)
      ),

      unit: "km/L",
    });

  } catch (error) {
    console.error(
      "Fuel Efficiency Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to calculate fuel efficiency",
    });
  }
};


// =========================
// Delete Fuel Expense
// =========================

exports.deleteFuelExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const fuelExpense =
      await FuelExpense.findOneAndDelete({
        _id: id,
        user: userId,
      });

    if (!fuelExpense) {
      return res.status(404).json({
        success: false,
        message: "Fuel expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Fuel expense deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete Fuel Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};