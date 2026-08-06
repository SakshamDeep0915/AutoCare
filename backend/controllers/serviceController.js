const Service = require("../models/Service");
const Vehicle = require("../models/Vehicle");

// ==========================
// Add Service
// ==========================
exports.addService = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.vehicleId,
      user: req.user.id,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    const service = await Service.create({
      ...req.body,
      vehicle: req.params.vehicleId,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Service added successfully",
      service,
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
// Get All Services
// ==========================
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({
      vehicle: req.params.vehicleId,
      user: req.user.id,
    }).sort({ serviceDate: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services,
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
// Get Single Service
// ==========================

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if(!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      service,
    });
  } catch(error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================
// Update Service
// ==========================
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service,
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
// Delete Service
// ==========================
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};