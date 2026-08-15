const Vehicle = require("../models/Vehicle");
const Service = require("../models/Service");
const FuelExpense = require("../models/FuelExpense");

// =====================================================
// Get Vehicle Health Alerts
// =====================================================

exports.getVehicleHealthAlerts = async (req, res) => {
  try {
    const userId = req.user.id;

    // =====================================================
    // Get User Vehicles
    // =====================================================

    const vehicles = await Vehicle.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    const alerts = [];

    // =====================================================
    // Alert Settings
    // =====================================================

    const SERVICE_INTERVAL_KM = 5000;
    const SERVICE_WARNING_KM = 1000;

    const INSURANCE_WARNING_DAYS = 30;

    const FUEL_EFFICIENCY_DROP_PERCENT = 15;

    // Expense must increase by 50% or more
    // compared with previous 3-month average
    const EXPENSE_SPIKE_PERCENT = 50;


    // =====================================================
    // Check Every Vehicle
    // =====================================================

    for (const vehicle of vehicles) {

      // ===================================================
      // GET LATEST SERVICE
      // ===================================================

      const latestService = await Service.findOne({
        vehicle: vehicle._id,
        user: userId,
      }).sort({
        serviceDate: -1,
      });


      // ===================================================
      // SERVICE ALERTS
      // ===================================================

      if (!latestService) {

        alerts.push({
          vehicleId: vehicle._id,

          vehicleName:
            `${vehicle.brand} ${vehicle.model}`,

          registrationNumber:
            vehicle.registrationNumber,

          type: "service",

          severity: "warning",

          title:
            "No Service History",

          message:
            "No service records found for this vehicle. Add a service record to start tracking its maintenance.",
        });

      } else {

        const currentOdometer =
          Number(vehicle.odometer);

        const lastServiceOdometer =
          Number(latestService.odometer);

        const distanceSinceService =
          currentOdometer -
          lastServiceOdometer;

        const remainingKm =
          SERVICE_INTERVAL_KM -
          distanceSinceService;


        // ===============================================
        // SERVICE OVERDUE
        // ===============================================

        if (
          distanceSinceService >=
          SERVICE_INTERVAL_KM
        ) {

          alerts.push({
            vehicleId: vehicle._id,

            vehicleName:
              `${vehicle.brand} ${vehicle.model}`,

            registrationNumber:
              vehicle.registrationNumber,

            type: "service",

            severity: "danger",

            title:
              "Service Overdue",

            message:
              `Your vehicle has travelled ${distanceSinceService.toLocaleString(
                "en-IN"
              )} km since its last service.`,

            lastServiceDate:
              latestService.serviceDate,

            lastServiceOdometer:
              lastServiceOdometer,

            currentOdometer:
              currentOdometer,

            distanceSinceService:
              distanceSinceService,
          });

        }


        // ===============================================
        // SERVICE DUE SOON
        // ===============================================

        else if (
          remainingKm <=
          SERVICE_WARNING_KM
        ) {

          alerts.push({
            vehicleId: vehicle._id,

            vehicleName:
              `${vehicle.brand} ${vehicle.model}`,

            registrationNumber:
              vehicle.registrationNumber,

            type: "service",

            severity: "warning",

            title:
              "Service Due Soon",

            message:
              `Your next service is due in approximately ${remainingKm.toLocaleString(
                "en-IN"
              )} km.`,

            lastServiceDate:
              latestService.serviceDate,

            lastServiceOdometer:
              lastServiceOdometer,

            currentOdometer:
              currentOdometer,

            remainingKm:
              remainingKm,
          });
        }
      }


      // ===================================================
      // INSURANCE ALERTS
      // ===================================================

      if (vehicle.insuranceExpiry) {

        const today = new Date();

        const expiryDate =
          new Date(
            vehicle.insuranceExpiry
          );

        const difference =
          expiryDate.getTime() -
          today.getTime();

        const daysRemaining =
          Math.ceil(
            difference /
              (1000 * 60 * 60 * 24)
          );


        // ===============================================
        // INSURANCE EXPIRED
        // ===============================================

        if (
          daysRemaining < 0
        ) {

          alerts.push({
            vehicleId: vehicle._id,

            vehicleName:
              `${vehicle.brand} ${vehicle.model}`,

            registrationNumber:
              vehicle.registrationNumber,

            type: "insurance",

            severity: "danger",

            title:
              "Insurance Expired",

            message:
              "The insurance for this vehicle has expired.",

            expiryDate:
              vehicle.insuranceExpiry,

            daysRemaining:
              daysRemaining,
          });

        }


        // ===============================================
        // INSURANCE EXPIRING SOON
        // ===============================================

        else if (
          daysRemaining <=
          INSURANCE_WARNING_DAYS
        ) {

          alerts.push({
            vehicleId: vehicle._id,

            vehicleName:
              `${vehicle.brand} ${vehicle.model}`,

            registrationNumber:
              vehicle.registrationNumber,

            type: "insurance",

            severity: "warning",

            title:
              "Insurance Expiring Soon",

            message:
              `Vehicle insurance expires in ${daysRemaining} days.`,

            expiryDate:
              vehicle.insuranceExpiry,

            daysRemaining:
              daysRemaining,
          });
        }
      }


      // ===================================================
      // FUEL EFFICIENCY ALERT
      // ===================================================

      // Electric vehicles are skipped because their
      // efficiency should be calculated using kWh.

      if (
        vehicle.fuelType !==
        "Electric"
      ) {

        const fuelRecords =
          await FuelExpense.find({
            vehicle:
              vehicle._id,

            user:
              userId,
          }).sort({
            odometer: 1,
          });


        // Need at least 4 fuel records
        if (
          fuelRecords.length >= 4
        ) {

          const efficiencyRecords =
            [];


          // =============================================
          // Calculate Efficiency
          // =============================================

          for (
            let i = 1;
            i < fuelRecords.length;
            i++
          ) {

            const previous =
              fuelRecords[i - 1];

            const current =
              fuelRecords[i];


            const distance =
              Number(
                current.odometer
              ) -
              Number(
                previous.odometer
              );


            const fuelUsed =
              Number(
                current.quantity
              );


            if (
              distance > 0 &&
              fuelUsed > 0
            ) {

              const efficiency =
                distance /
                fuelUsed;


              efficiencyRecords.push({
                efficiency:
                  efficiency,

                odometer:
                  current.odometer,

                date:
                  current.fuelDate,
              });
            }
          }


          // =============================================
          // Need at least 3 calculations
          // =============================================

          if (
            efficiencyRecords.length >=
            3
          ) {

            const recentCount =
              Math.min(
                3,

                Math.floor(
                  efficiencyRecords.length /
                    2
                )
              );


            const previousRecords =
              efficiencyRecords.slice(
                0,
                -recentCount
              );


            const recentRecords =
              efficiencyRecords.slice(
                -recentCount
              );


            // =========================================
            // Previous Average
            // =========================================

            const previousAverage =
              previousRecords.reduce(
                (
                  sum,
                  record
                ) =>
                  sum +
                  record.efficiency,

                0
              ) /
              previousRecords.length;


            // =========================================
            // Recent Average
            // =========================================

            const recentAverage =
              recentRecords.reduce(
                (
                  sum,
                  record
                ) =>
                  sum +
                  record.efficiency,

                0
              ) /
              recentRecords.length;


            // =========================================
            // Calculate Drop
            // =========================================

            if (
              previousAverage > 0 &&
              recentAverage > 0
            ) {

              const efficiencyDrop =
                (
                  (
                    previousAverage -
                    recentAverage
                  ) /
                  previousAverage
                ) *
                100;


              // =======================================
              // Generate Fuel Alert
              // =======================================

              if (
                efficiencyDrop >=
                FUEL_EFFICIENCY_DROP_PERCENT
              ) {

                alerts.push({
                  vehicleId:
                    vehicle._id,

                  vehicleName:
                    `${vehicle.brand} ${vehicle.model}`,

                  registrationNumber:
                    vehicle.registrationNumber,

                  type:
                    "fuel-efficiency",

                  severity:
                    "warning",

                  title:
                    "Fuel Efficiency Dropped",

                  message:
                    `Fuel efficiency has decreased by ${efficiencyDrop.toFixed(
                      1
                    )}% compared to the previous average.`,

                  previousEfficiency:
                    Number(
                      previousAverage.toFixed(
                        2
                      )
                    ),

                  currentEfficiency:
                    Number(
                      recentAverage.toFixed(
                        2
                      )
                    ),

                  efficiencyDrop:
                    Number(
                      efficiencyDrop.toFixed(
                        1
                      )
                    ),

                  unit:
                    vehicle.fuelType ===
                    "CNG"
                      ? "km/kg"
                      : "km/L",
                });
              }
            }
          }
        }
      }


      // ===================================================
      // EXPENSE SPIKE ALERT
      // ===================================================

      const today = new Date();

      // Start of current month
      const currentMonthStart =
        new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );


      // Start of previous 3 months
      const previousThreeMonthsStart =
        new Date(
          today.getFullYear(),
          today.getMonth() - 3,
          1
        );


      // ===================================================
      // Get Maintenance Expenses
      // ===================================================

      const serviceExpenses =
        await Service.find({
          vehicle:
            vehicle._id,

          user:
            userId,

          serviceDate: {
            $gte:
              previousThreeMonthsStart,
          },

        }).select(
          "cost serviceDate"
        );


      // ===================================================
      // Get Fuel Expenses
      // ===================================================

      const fuelExpenses =
        await FuelExpense.find({
          vehicle:
            vehicle._id,

          user:
            userId,

          fuelDate: {
            $gte:
              previousThreeMonthsStart,
          },

        }).select(
          "totalCost fuelDate"
        );


      // ===================================================
      // Current Month Expense
      // ===================================================

      let currentMonthExpense = 0;


      // Maintenance
      serviceExpenses.forEach(
        (service) => {

          const date =
            new Date(
              service.serviceDate
            );


          if (
            date >=
            currentMonthStart
          ) {

            currentMonthExpense +=
              Number(
                service.cost
              ) || 0;
          }
        }
      );


      // Fuel
      fuelExpenses.forEach(
        (fuel) => {

          const date =
            new Date(
              fuel.fuelDate
            );


          if (
            date >=
            currentMonthStart
          ) {

            currentMonthExpense +=
              Number(
                fuel.totalCost
              ) || 0;
          }
        }
      );


      // ===================================================
      // Previous 3 Months
      // ===================================================

      const monthlyExpenses = [
        0,
        0,
        0,
      ];


      // ===================================================
      // Maintenance Expenses
      // ===================================================

      serviceExpenses.forEach(
        (service) => {

          const date =
            new Date(
              service.serviceDate
            );


          const monthDifference =
            (
              today.getFullYear() -
              date.getFullYear()
            ) *
              12 +
            (
              today.getMonth() -
              date.getMonth()
            );


          if (
            monthDifference >= 1 &&
            monthDifference <= 3
          ) {

            monthlyExpenses[
              monthDifference - 1
            ] +=
              Number(
                service.cost
              ) || 0;
          }
        }
      );


      // ===================================================
      // Fuel Expenses
      // ===================================================

      fuelExpenses.forEach(
        (fuel) => {

          const date =
            new Date(
              fuel.fuelDate
            );


          const monthDifference =
            (
              today.getFullYear() -
              date.getFullYear()
            ) *
              12 +
            (
              today.getMonth() -
              date.getMonth()
            );


          if (
            monthDifference >= 1 &&
            monthDifference <= 3
          ) {

            monthlyExpenses[
              monthDifference - 1
            ] +=
              Number(
                fuel.totalCost
              ) || 0;
          }
        }
      );


      // ===================================================
      // Previous 3-Month Average
      // ===================================================

      const previousAverage =
        monthlyExpenses.reduce(
          (
            sum,
            expense
          ) =>
            sum + expense,

          0
        ) / 3;


      // ===================================================
      // Calculate Expense Increase
      // ===================================================

      if (
        previousAverage > 0 &&
        currentMonthExpense > 0
      ) {

        const expenseIncrease =
          (
            (
              currentMonthExpense -
              previousAverage
            ) /
            previousAverage
          ) *
          100;


        // =================================================
        // Generate Expense Alert
        // =================================================

        if (
          expenseIncrease >=
          EXPENSE_SPIKE_PERCENT
        ) {

          alerts.push({

            vehicleId:
              vehicle._id,

            vehicleName:
              `${vehicle.brand} ${vehicle.model}`,

            registrationNumber:
              vehicle.registrationNumber,

            type:
              "expense-spike",

            severity:
              "warning",

            title:
              "High Vehicle Expenses",

            message:
              `Vehicle expenses have increased by ${expenseIncrease.toFixed(
                1
              )}% compared to the previous 3-month average.`,

            currentExpense:
              Number(
                currentMonthExpense.toFixed(
                  2
                )
              ),

            previousAverage:
              Number(
                previousAverage.toFixed(
                  2
                )
              ),

            expenseIncrease:
              Number(
                expenseIncrease.toFixed(
                  1
                )
              ),
          });
        }
      }
    }


    // =====================================================
    // Sort Alerts
    // Danger → Warning
    // =====================================================

    alerts.sort(
      (a, b) => {

        if (
          a.severity ===
            "danger" &&
          b.severity !==
            "danger"
        ) {
          return -1;
        }

        if (
          a.severity !==
            "danger" &&
          b.severity ===
            "danger"
        ) {
          return 1;
        }

        return 0;
      }
    );


    // =====================================================
    // Response
    // =====================================================

    res.status(200).json({

      success:
        true,

      totalAlerts:
        alerts.length,

      alerts,
    });


  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "VEHICLE HEALTH ALERT ERROR"
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Stack:",
      error.stack
    );

    console.error(
      "================================="
    );


    res.status(500).json({

      success:
        false,

      message:
        "Failed to generate vehicle health alerts",

      error:
        error.message,
    });
  }
};