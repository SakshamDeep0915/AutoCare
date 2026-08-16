const mongoose = require("mongoose");

const Vehicle = require("../models/Vehicle");
const Service = require("../models/Service");
const FuelExpense = require("../models/FuelExpense");

// ==================================================
// Dashboard
// ==================================================

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const objectUserId =
      new mongoose.Types.ObjectId(userId);

    // =========================
    // Total Vehicles
    // =========================

    const totalVehicles =
      await Vehicle.countDocuments({
        user: userId,
      });

    // =========================
    // Total Services
    // =========================

    const totalServices =
      await Service.countDocuments({
        user: userId,
      });

    // =========================
    // Total Maintenance Cost
    // =========================

    const maintenanceResult =
      await Service.aggregate([
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

    const fuelResult =
      await FuelExpense.aggregate([
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

    const vehicles =
      await Vehicle.find({
        user: userId,
      }).sort({
        createdAt: -1,
      });

    // =========================
    // Recent Services
    // =========================

    const recentServices =
      await Service.find({
        user: userId,
      })
        .populate(
          "vehicle",
          "brand model"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5);

    // =========================
    // Recent Fuel Expenses
    // =========================

    const recentFuelExpenses =
      await FuelExpense.find({
        user: userId,
      })
        .populate(
          "vehicle",
          "brand model"
        )
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

      maintenanceCost,

      fuelExpense,

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


// ==================================================
// Monthly Expenses
// Maintenance + Fuel
// ==================================================

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

    maintenanceExpenses.forEach(
      (item) => {
        const key =
          `${item._id.year}-${item._id.month}`;

        monthlyMap[key] = {
          year: item._id.year,

          month: item._id.month,

          maintenanceExpense:
            item.totalExpense,

          fuelExpense: 0,

          totalExpense:
            item.totalExpense,
        };
      }
    );

    // Add fuel expenses

    fuelExpenses.forEach(
      (item) => {
        const key =
          `${item._id.year}-${item._id.month}`;

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
      }
    );

    // Convert object to array

    const monthlyExpenses =
      Object.values(
        monthlyMap
      ).sort((a, b) => {
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


// ==================================================
// Date-Wise Expense Report
// Maintenance + Fuel
// Search by Registration Number
// ==================================================

exports.getExpenseReport = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      registrationNumber,
      from,
      to,
    } = req.query;

    // ==================================================
    // Find Vehicle Using Registration Number
    // ==================================================

    let vehicle = null;

    if (registrationNumber) {
      vehicle = await Vehicle.findOne({
        user: userId,

        registrationNumber: {
          $regex: `^${registrationNumber.trim()}$`,
          $options: "i",
        },
      });

      if (!vehicle) {
        return res.status(404).json({
          success: false,

          message:
            "Vehicle not found with this registration number",
        });
      }
    }

    // ==================================================
    // Base Filters
    // ==================================================

    const serviceFilter = {
      user: new mongoose.Types.ObjectId(userId),
    };

    const fuelFilter = {
      user: new mongoose.Types.ObjectId(userId),
    };

    // ==================================================
    // Vehicle Filter
    // ==================================================

    if (vehicle) {
      serviceFilter.vehicle =
        vehicle._id;

      fuelFilter.vehicle =
        vehicle._id;
    }

    // ==================================================
    // Date Filter
    // ==================================================

    if (from || to) {
      const serviceDateFilter = {};
      const fuelDateFilter = {};

      if (from) {
        const startDate =
          new Date(from);

        startDate.setHours(
          0,
          0,
          0,
          0
        );

        serviceDateFilter.$gte =
          startDate;

        fuelDateFilter.$gte =
          startDate;
      }

      if (to) {
        const endDate =
          new Date(to);

        endDate.setHours(
          23,
          59,
          59,
          999
        );

        serviceDateFilter.$lte =
          endDate;

        fuelDateFilter.$lte =
          endDate;
      }

      serviceFilter.serviceDate =
        serviceDateFilter;

      fuelFilter.fuelDate =
        fuelDateFilter;
    }

    // ==================================================
    // Get Maintenance Expenses
    // ==================================================

    const services =
      await Service.find(
        serviceFilter
      )
        .populate(
          "vehicle",
          "brand model registrationNumber"
        )
        .sort({
          serviceDate: -1,
        });

    // ==================================================
    // Get Fuel Expenses
    // ==================================================

    const fuelExpenses =
      await FuelExpense.find(
        fuelFilter
      )
        .populate(
          "vehicle",
          "brand model registrationNumber"
        )
        .sort({
          fuelDate: -1,
        });

    // ==================================================
    // Combine Expenses
    // ==================================================

    const expenses = [];

    // --------------------------------------------------
    // Maintenance
    // --------------------------------------------------

    services.forEach(
      (service) => {
        expenses.push({
          date:
            service.serviceDate,

          type: "Maintenance",

          vehicle:
            service.vehicle
              ? `${service.vehicle.brand} ${service.vehicle.model}`
              : "Unknown Vehicle",

          registrationNumber:
            service.vehicle
              ?.registrationNumber || "",

          description:
            service.serviceType ||
            "Vehicle Service",

          amount:
            Number(service.cost) || 0,
        });
      }
    );

    // --------------------------------------------------
    // Fuel
    // --------------------------------------------------

    fuelExpenses.forEach(
      (fuel) => {
        expenses.push({
          date:
            fuel.fuelDate,

          type: "Fuel",

          vehicle:
            fuel.vehicle
              ? `${fuel.vehicle.brand} ${fuel.vehicle.model}`
              : "Unknown Vehicle",

          registrationNumber:
            fuel.vehicle
              ?.registrationNumber || "",

          description:
            `${fuel.fuelType || "Fuel"} - ${
              fuel.quantity || 0
            } units`,

          amount:
            Number(fuel.totalCost) || 0,
        });
      }
    );

    // ==================================================
    // Sort Date-wise
    // Latest First
    // ==================================================

    expenses.sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );

    // ==================================================
    // Calculate Maintenance Total
    // ==================================================

    const totalMaintenance =
      services.reduce(
        (sum, service) =>
          sum +
          (Number(service.cost) || 0),
        0
      );

    // ==================================================
    // Calculate Fuel Total
    // ==================================================

    const totalFuel =
      fuelExpenses.reduce(
        (sum, fuel) =>
          sum +
          (Number(fuel.totalCost) || 0),
        0
      );

    // ==================================================
    // Grand Total
    // ==================================================

    const totalExpense =
      totalMaintenance +
      totalFuel;

    // ==================================================
    // Response
    // ==================================================

    res.status(200).json({
      success: true,

      vehicle: vehicle
        ? {
            id: vehicle._id,

            brand: vehicle.brand,

            model: vehicle.model,

            year: vehicle.year,

            registrationNumber:
              vehicle.registrationNumber,

            fuelType:
              vehicle.fuelType,

            odometer:
              vehicle.odometer,
          }
        : null,

      totalMaintenance,

      totalFuel,

      totalExpense,

      totalRecords:
        expenses.length,

      expenses,
    });

  } catch (error) {
    console.error(
      "Expense Report Error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to generate expense report",

      error: error.message,
    });
  }
};