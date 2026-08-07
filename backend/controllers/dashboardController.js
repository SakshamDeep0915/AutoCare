const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");
const Service = require("../models/Service");

// Dashboard
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total Vehicles
    const totalVehicles = await Vehicle.countDocuments({
      user: userId,
    });

    // Total Services
    const totalServices = await Service.countDocuments({
      user: userId,
    });

    // Total Maintenance Cost
    const costResult = await Service.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },

      {
        $group: {
          _id: null,
          totalCost: {
            $sum: "$cost",
          },
        },
      },
    ]);

    const totalCost = 
    costResult.length > 0 ? costResult[0].totalCost : 0;

    const vehicles = await Vehicle.find({
      user: userId,
    }).sort({ createdAt: -1 });
    
    const recentServices = await Service.find({
      user: userId,
    })
    .populate("vehicle", "brand model")
    .sort({ createdAt: -1 })
    .limit(5);

    res.status(200).json({
      success: true,
      totalVehicles,
      totalServices,
      totalCost,
      vehicles,
      recentServices,
    });
  } catch (error) {
    console.error("Dashboard Error: ", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getMonthlyExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const monthlyExpenses = await Service.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },

      {
        $group: {
          _id: {
            year: { $year: "$serviceDate" },
            month: { $month: "$serviceDate" },
          },

          totalExpense: {
            $sum: "$cost",
          },
        },
      },
    ]);

    res.json({
      success: true,
      monthlyExpenses,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};