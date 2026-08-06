const Vehicle = require("../models/Vehicle");

// ==========================
// Add Vehicle
// ==========================
exports.addVehicle = async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      registrationNumber,
      registrationType,
      fuelType,
      transmission,
      odometer,
      owners,
      insuranceExpiry,
    } = req.body;

    const vehicle = await Vehicle.create({
      user: req.user.id,
      brand,
      model,
      year,
      registrationNumber,
      registrationType,
      fuelType,
      transmission,
      odometer,
      owners,
      insuranceExpiry,
    });

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      vehicle,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================
// Get My Vehicles
// ==========================
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================
// Get Vehicle By ID
// ==========================
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      vehicle,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================
// Update Vehicle
// ==========================
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================
// Delete Vehicle
// ==========================
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};