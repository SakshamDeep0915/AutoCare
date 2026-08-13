const mongoose = require("mongoose");

const Vehicle = require("../models/Vehicle");
const Service = require("../models/Service");
const FuelExpense = require("../models/FuelExpense");

// =========================
// Dashboard
// =========================
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const objectUserId = new mongoose.Types.ObjectId(userId);

    // =========================
    // Total Vehicles
    // =========================
    const totalVehicles = await Vehicle.countDocuments({
      user: userId,
    });

    // =========================
    // Total Services
    // =========================
    const totalServices = await Service.countDocuments({
      user: userId,
    });

    // =========================
    // Total Maintenance Cost
    // =========================
    const maintenanceResult = await Service.aggregate([
      {
        $match: {
          user: objectUserId,
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

    const maintenanceCost =
      maintenanceResult.length > 0
        ? maintenanceResult[0].totalCost
        : 0;

    // =========================
    // Total Fuel Expense
    // =========================
    const fuelResult = await FuelExpense.aggregate([
      {
        $match: {
          user: objectUserId,
        },
      },
      {
        $group: {
          _id: null,
          totalCost: {
            $sum: "$totalCost",
          },
        },
      },
    ]);

    const fuelExpense =
      fuelResult.length > 0
        ? fuelResult[0].totalCost
        : 0;

    // =========================
    // Total Expense
    // Maintenance + Fuel
    // =========================
    const totalExpense =
      maintenanceCost + fuelExpense;

    // =========================
    // All Vehicles
    // =========================
    const vehicles = await Vehicle.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    // =========================
    // Recent Services
    // =========================
    const recentServices = await Service.find({
      user: userId,
    })
      .populate("vehicle", "brand model")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    // =========================
    // Recent Fuel Expenses
    // =========================
    const recentFuelExpenses = await FuelExpense.find({
      user: userId,
    })
      .populate("vehicle", "brand model")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    // =========================
    // Response
    // =========================
    res.status(200).json({
      success: true,

      totalVehicles,

      totalServices,

      // Maintenance only
      maintenanceCost,

      // Fuel only
      fuelExpense,

      // Maintenance + Fuel
      totalExpense,

      vehicles,

      recentServices,

      recentFuelExpenses,
    });

  } catch (error) {
    console.error(
      "Dashboard Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// =========================
// Monthly Expenses
// Maintenance + Fuel
// =========================
exports.getMonthlyExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const objectUserId =
      new mongoose.Types.ObjectId(userId);

    // =========================
    // Monthly Maintenance
    // =========================
    const maintenanceExpenses =
      await Service.aggregate([
        {
          $match: {
            user: objectUserId,
          },
        },

        {
          $group: {
            _id: {
              year: {
                $year: "$serviceDate",
              },

              month: {
                $month: "$serviceDate",
              },
            },

            totalExpense: {
              $sum: "$cost",
            },
          },
        },
      ]);

    // =========================
    // Monthly Fuel
    // =========================
    const fuelExpenses =
      await FuelExpense.aggregate([
        {
          $match: {
            user: objectUserId,
          },
        },

        {
          $group: {
            _id: {
              year: {
                $year: "$fuelDate",
              },

              month: {
                $month: "$fuelDate",
              },
            },

            totalExpense: {
              $sum: "$totalCost",
            },
          },
        },
      ]);

    // =========================
    // Combine Both
    // =========================
    const monthlyMap = {};

    // Add maintenance expenses
    maintenanceExpenses.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;

      monthlyMap[key] = {
        year: item._id.year,
        month: item._id.month,
        maintenanceExpense: item.totalExpense,
        fuelExpense: 0,
        totalExpense: item.totalExpense,
      };
    });

    // Add fuel expenses
    fuelExpenses.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;

      if (!monthlyMap[key]) {
        monthlyMap[key] = {
          year: item._id.year,
          month: item._id.month,
          maintenanceExpense: 0,
          fuelExpense: 0,
          totalExpense: 0,
        };
      }

      monthlyMap[key].fuelExpense +=
        item.totalExpense;

      monthlyMap[key].totalExpense +=
        item.totalExpense;
    });

    // Convert object to array
    const monthlyExpenses =
      Object.values(monthlyMap).sort((a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }

        return a.month - b.month;
      });

    // =========================
    // Response
    // =========================
    res.status(200).json({
      success: true,
      monthlyExpenses,
    });

  } catch (error) {
    console.error(
      "Monthly Expenses Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};