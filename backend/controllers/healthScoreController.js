const Vehicle = require("../models/Vehicle");
const Service = require("../models/Service");
const FuelExpense = require("../models/FuelExpense");


// =====================================================
// Get Vehicle Health Score
// =====================================================

exports.getVehicleHealthScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vehicleId } = req.params;


    // ===================================================
    // Find Vehicle
    // ===================================================

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


    // ===================================================
    // Get Service History
    // ===================================================

    const services = await Service.find({
      vehicle: vehicleId,
      user: userId,
    }).sort({
      serviceDate: -1,
    });


    // ===================================================
    // Get Fuel History
    // ===================================================

    const fuelRecords = await FuelExpense.find({
      vehicle: vehicleId,
      user: userId,
    }).sort({
      odometer: 1,
    });


    // ===================================================
    // 1. MAINTENANCE SCORE - 30
    // ===================================================

    let maintenanceScore = 30;


    if (services.length === 0) {
      maintenanceScore = 10;
    } else {

      const latestService = services[0];

      const distanceSinceService =
        Number(vehicle.odometer) -
        Number(latestService.odometer);


      if (distanceSinceService >= 5000) {
        maintenanceScore = 10;
      }

      else if (distanceSinceService >= 4000) {
        maintenanceScore = 20;
      }

      else {
        maintenanceScore = 30;
      }
    }


    // ===================================================
    // 2. FUEL EFFICIENCY SCORE - 25
    // ===================================================

    let fuelEfficiencyScore = 25;

    let currentEfficiency = null;


    if (
      vehicle.fuelType !== "Electric" &&
      fuelRecords.length >= 2
    ) {

      const efficiencyRecords = [];


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
          Number(current.odometer) -
          Number(previous.odometer);


        const fuelUsed =
          Number(current.quantity);


        if (
          distance > 0 &&
          fuelUsed > 0
        ) {

          efficiencyRecords.push(
            distance / fuelUsed
          );
        }
      }


      if (
        efficiencyRecords.length > 0
      ) {

        currentEfficiency =
          efficiencyRecords[
            efficiencyRecords.length - 1
          ];


        const averageEfficiency =
          efficiencyRecords.reduce(
            (sum, value) =>
              sum + value,
            0
          ) /
          efficiencyRecords.length;


        if (
          currentEfficiency >=
          averageEfficiency * 0.95
        ) {
          fuelEfficiencyScore = 25;
        }

        else if (
          currentEfficiency >=
          averageEfficiency * 0.85
        ) {
          fuelEfficiencyScore = 20;
        }

        else if (
          currentEfficiency >=
          averageEfficiency * 0.70
        ) {
          fuelEfficiencyScore = 15;
        }

        else {
          fuelEfficiencyScore = 8;
        }
      }

    }


    // ===================================================
    // 3. EXPENSE SCORE - 20
    // ===================================================

    let expenseScore = 20;


    const today = new Date();

    const currentMonthStart =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );


    const previousThreeMonthsStart =
      new Date(
        today.getFullYear(),
        today.getMonth() - 3,
        1
      );


    // Service expenses
    const serviceExpenses =
      await Service.find({
        vehicle: vehicleId,
        user: userId,

        serviceDate: {
          $gte:
            previousThreeMonthsStart,
        },
      }).select(
        "cost serviceDate"
      );


    // Fuel expenses
    const fuelExpenses =
      await FuelExpense.find({
        vehicle: vehicleId,
        user: userId,

        fuelDate: {
          $gte:
            previousThreeMonthsStart,
        },
      }).select(
        "totalCost fuelDate"
      );


    let currentMonthExpense = 0;

    const previousMonthlyExpenses = [
      0,
      0,
      0,
    ];


    // Service expenses
    serviceExpenses.forEach(
      (service) => {

        const date =
          new Date(
            service.serviceDate
          );


        const cost =
          Number(service.cost) || 0;


        if (
          date >=
          currentMonthStart
        ) {

          currentMonthExpense +=
            cost;

        }

        else {

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

            previousMonthlyExpenses[
              monthDifference - 1
            ] += cost;

          }
        }
      }
    );


    // Fuel expenses
    fuelExpenses.forEach(
      (fuel) => {

        const date =
          new Date(
            fuel.fuelDate
          );


        const cost =
          Number(
            fuel.totalCost
          ) || 0;


        if (
          date >=
          currentMonthStart
        ) {

          currentMonthExpense +=
            cost;

        }

        else {

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

            previousMonthlyExpenses[
              monthDifference - 1
            ] += cost;

          }
        }
      }
    );


    const previousAverage =
      previousMonthlyExpenses.reduce(
        (sum, value) =>
          sum + value,
        0
      ) / 3;


    if (
      previousAverage > 0 &&
      currentMonthExpense >
        previousAverage * 1.5
    ) {

      expenseScore = 8;

    }

    else if (
      previousAverage > 0 &&
      currentMonthExpense >
        previousAverage * 1.25
    ) {

      expenseScore = 14;

    }

    else {

      expenseScore = 20;

    }


    // ===================================================
    // 4. INSURANCE SCORE - 25
    // ===================================================

    let insuranceScore = 25;

    let insuranceDaysRemaining =
      null;


    if (
      vehicle.insuranceExpiry
    ) {

      const todayDate =
        new Date();

      const expiryDate =
        new Date(
          vehicle.insuranceExpiry
        );


      const difference =
        expiryDate.getTime() -
        todayDate.getTime();


      insuranceDaysRemaining =
        Math.ceil(
          difference /
            (1000 * 60 * 60 * 24)
        );


      if (
        insuranceDaysRemaining < 0
      ) {

        insuranceScore = 0;

      }

      else if (
        insuranceDaysRemaining <= 30
      ) {

        insuranceScore = 10;

      }

      else if (
        insuranceDaysRemaining <= 90
      ) {

        insuranceScore = 18;

      }

      else {

        insuranceScore = 25;

      }

    }


    // ===================================================
    // TOTAL HEALTH SCORE
    // ===================================================

    const healthScore =
      Math.round(
        maintenanceScore +
        fuelEfficiencyScore +
        expenseScore +
        insuranceScore
      );


    // ===================================================
    // Status
    // ===================================================

    let status = "";
    let statusColor = "";


    if (healthScore >= 90) {

      status = "Excellent";
      statusColor = "green";

    }

    else if (healthScore >= 75) {

      status = "Good";
      statusColor = "green";

    }

    else if (healthScore >= 60) {

      status = "Fair";
      statusColor = "yellow";

    }

    else if (healthScore >= 40) {

      status = "Needs Attention";
      statusColor = "orange";

    }

    else {

      status = "Critical";
      statusColor = "red";

    }


    // ===================================================
    // Recommendations
    // ===================================================

    const recommendations = [];


    if (
      maintenanceScore < 30
    ) {

      recommendations.push(
        "Consider scheduling a vehicle service."
      );

    }


    if (
      fuelEfficiencyScore < 25
    ) {

      recommendations.push(
        "Fuel efficiency has decreased. Check tyre pressure, engine condition and driving habits."
      );

    }


    if (
      expenseScore < 20
    ) {

      recommendations.push(
        "Vehicle expenses are higher than usual. Review recent maintenance and fuel costs."
      );

    }


    if (
      insuranceScore < 25
    ) {

      recommendations.push(
        "Check your vehicle insurance validity and renew it if required."
      );

    }


    // ===================================================
    // Response
    // ===================================================

    res.status(200).json({

      success: true,

      vehicle: {
        id: vehicle._id,
        brand: vehicle.brand,
        model: vehicle.model,
        registrationNumber:
          vehicle.registrationNumber,
      },

      healthScore,

      status,

      statusColor,

      breakdown: {

        maintenance: {
          score:
            maintenanceScore,
          maxScore: 30,
        },

        fuelEfficiency: {
          score:
            fuelEfficiencyScore,
          maxScore: 25,

          currentEfficiency:
            currentEfficiency
              ? Number(
                  currentEfficiency.toFixed(
                    2
                  )
                )
              : null,
        },

        expenses: {
          score:
            expenseScore,
          maxScore: 20,

          currentMonthExpense:
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
        },

        insurance: {
          score:
            insuranceScore,
          maxScore: 25,

          daysRemaining:
            insuranceDaysRemaining,
        },
      },

      recommendations,
    });

  } catch (error) {

    console.error(
      "Health Score Error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to calculate vehicle health score",

      error:
        error.message,
    });
  }
};