const Vehicle = require("../models/Vehicle");
const Service = require("../models/Service");
const FuelExpense = require("../models/FuelExpense");


// =====================================================
// HELPERS
// =====================================================

const clamp = (value, min, max) => {
  return Math.min(
    Math.max(value, min),
    max
  );
};


const round = (value, decimals = 2) => {
  const factor = Math.pow(
    10,
    decimals
  );

  return (
    Math.round(
      (value + Number.EPSILON) *
        factor
    ) / factor
  );
};


// =====================================================
// GET VEHICLE HEALTH SCORE
// =====================================================

exports.getVehicleHealthScore = async (
  req,
  res
) => {

  try {

    const userId =
      req.user.id;

    const {
      vehicleId,
    } = req.params;


    // ===================================================
    // FIND VEHICLE
    // ===================================================

    const vehicle =
      await Vehicle.findOne({

        _id: vehicleId,

        user: userId,

      });


    if (!vehicle) {

      return res.status(404).json({

        success: false,

        message:
          "Vehicle not found",

      });

    }


    // ===================================================
    // SERVICE HISTORY
    // ===================================================

    const services =
      await Service.find({

        vehicle: vehicleId,

        user: userId,

      }).sort({

        serviceDate: -1,

      });


    // ===================================================
    // FUEL HISTORY
    // ===================================================

    const fuelRecords =
      await FuelExpense.find({

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

      // No service history means we have
      // limited evidence of maintenance.

      maintenanceScore = 12;

    } else {

      const latestService =
        services[0];


      const currentOdometer =
        Number(
          vehicle.odometer
        ) || 0;


      const serviceOdometer =
        Number(
          latestService.odometer
        ) || 0;


      const distanceSinceService =
        Math.max(
          0,
          currentOdometer -
            serviceOdometer
        );


      // -------------------------------------------------
      // More granular maintenance scoring
      // -------------------------------------------------

      if (
        distanceSinceService <= 1000
      ) {

        maintenanceScore = 30;

      }

      else if (
        distanceSinceService <= 2000
      ) {

        maintenanceScore = 29;

      }

      else if (
        distanceSinceService <= 3000
      ) {

        maintenanceScore = 28;

      }

      else if (
        distanceSinceService <= 4000
      ) {

        maintenanceScore = 26;

      }

      else if (
        distanceSinceService <= 5000
      ) {

        maintenanceScore = 23;

      }

      else if (
        distanceSinceService <= 6000
      ) {

        maintenanceScore = 20;

      }

      else if (
        distanceSinceService <= 7500
      ) {

        maintenanceScore = 17;

      }

      else if (
        distanceSinceService <= 10000
      ) {

        maintenanceScore = 14;

      }

      else if (
        distanceSinceService <= 15000
      ) {

        maintenanceScore = 10;

      }

      else {

        maintenanceScore = 6;

      }


      // -------------------------------------------------
      // Service frequency bonus / penalty
      // -------------------------------------------------

      if (
        services.length >= 3
      ) {

        const recentServices =
          services.slice(
            0,
            3
          );


        const serviceIntervals = [];


        for (
          let i = 0;
          i <
            recentServices.length - 1;
          i++
        ) {

          const current =
            Number(
              recentServices[i]
                .odometer
            );


          const previous =
            Number(
              recentServices[i + 1]
                .odometer
            );


          const interval =
            current -
            previous;


          if (
            interval > 0
          ) {

            serviceIntervals.push(
              interval
            );

          }

        }


        if (
          serviceIntervals.length > 0
        ) {

          const averageInterval =
            serviceIntervals.reduce(
              (
                sum,
                value
              ) =>
                sum + value,
              0
            ) /
            serviceIntervals.length;


          // Consistent servicing improves
          // the maintenance score slightly.

          if (
            averageInterval <= 7000
          ) {

            maintenanceScore +=
              1;

          }

          else if (
            averageInterval >= 12000
          ) {

            maintenanceScore -=
              2;

          }

        }

      }


      maintenanceScore =
        clamp(
          maintenanceScore,
          0,
          30
        );

    }


    // ===================================================
    // 2. FUEL EFFICIENCY SCORE - 25
    // ===================================================

    let fuelEfficiencyScore = 25;

    let currentEfficiency =
      null;


    if (
      vehicle.fuelType !==
        "Electric" &&
      fuelRecords.length >= 2
    ) {

      const efficiencyRecords = [];


      for (
        let i = 1;
        i <
          fuelRecords.length;
        i++
      ) {

        const previous =
          fuelRecords[i - 1];


        const current =
          fuelRecords[i];


        const previousOdometer =
          Number(
            previous.odometer
          );


        const currentOdometer =
          Number(
            current.odometer
          );


        const distance =
          currentOdometer -
          previousOdometer;


        const fuelUsed =
          Number(
            current.quantity
          );


        if (
          distance > 0 &&
          fuelUsed > 0
        ) {

          efficiencyRecords.push(
            distance /
              fuelUsed
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
            (
              sum,
              value
            ) =>
              sum + value,
            0
          ) /
          efficiencyRecords.length;


        // -------------------------------------------------
        // Compare current efficiency with historical
        // average.
        // -------------------------------------------------

        const efficiencyRatio =
          averageEfficiency > 0
            ? currentEfficiency /
              averageEfficiency
            : 1;


        if (
          efficiencyRatio >= 1.10
        ) {

          fuelEfficiencyScore =
            25;

        }

        else if (
          efficiencyRatio >= 1.05
        ) {

          fuelEfficiencyScore =
            24;

        }

        else if (
          efficiencyRatio >= 1.00
        ) {

          fuelEfficiencyScore =
            23;

        }

        else if (
          efficiencyRatio >= 0.95
        ) {

          fuelEfficiencyScore =
            21;

        }

        else if (
          efficiencyRatio >= 0.90
        ) {

          fuelEfficiencyScore =
            19;

        }

        else if (
          efficiencyRatio >= 0.85
        ) {

          fuelEfficiencyScore =
            17;

        }

        else if (
          efficiencyRatio >= 0.80
        ) {

          fuelEfficiencyScore =
            14;

        }

        else if (
          efficiencyRatio >= 0.70
        ) {

          fuelEfficiencyScore =
            11;

        }

        else {

          fuelEfficiencyScore =
            7;

        }

      }

    }


    // Electric vehicles do not use
    // conventional fuel efficiency data.

    if (
      vehicle.fuelType ===
      "Electric"
    ) {

      fuelEfficiencyScore =
        25;

    }


    // ===================================================
    // 3. EXPENSE SCORE - 20
    // ===================================================

    let expenseScore = 20;


    const today =
      new Date();


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


    // ===================================================
    // SERVICE EXPENSES
    // ===================================================

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


    // ===================================================
    // FUEL EXPENSES
    // ===================================================

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


    let currentMonthExpense =
      0;


    const previousMonthlyExpenses = [
      0,
      0,
      0,
    ];


    // ===================================================
    // SERVICE EXPENSE CALCULATION
    // ===================================================

    serviceExpenses.forEach(
      (service) => {

        const date =
          new Date(
            service.serviceDate
          );


        const cost =
          Number(
            service.cost
          ) || 0;


        if (
          date >=
          currentMonthStart
        ) {

          currentMonthExpense +=
            cost;

        } else {

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


    // ===================================================
    // FUEL EXPENSE CALCULATION
    // ===================================================

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

        } else {

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
        (
          sum,
          value
        ) =>
          sum + value,
        0
      ) / 3;


    // ---------------------------------------------------
    // Expense ratio
    // ---------------------------------------------------

    if (
      previousAverage <= 0
    ) {

      // No historical baseline.
      // Keep a neutral-high score.

      expenseScore = 18;

    } else {

      const expenseRatio =
        currentMonthExpense /
        previousAverage;


      if (
        expenseRatio <= 0.70
      ) {

        expenseScore = 20;

      }

      else if (
        expenseRatio <= 0.85
      ) {

        expenseScore = 19;

      }

      else if (
        expenseRatio <= 1.00
      ) {

        expenseScore = 18;

      }

      else if (
        expenseRatio <= 1.10
      ) {

        expenseScore = 17;

      }

      else if (
        expenseRatio <= 1.20
      ) {

        expenseScore = 16;

      }

      else if (
        expenseRatio <= 1.30
      ) {

        expenseScore = 14;

      }

      else if (
        expenseRatio <= 1.50
      ) {

        expenseScore = 12;

      }

      else if (
        expenseRatio <= 1.75
      ) {

        expenseScore = 9;

      }

      else {

        expenseScore = 6;

      }

    }


    // ===================================================
    // 4. INSURANCE SCORE - 25
    // ===================================================

    let insuranceScore =
      25;


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


      // Remove time-of-day from both
      // dates so repeated requests on
      // the same date give the same result.

      todayDate.setHours(
        0,
        0,
        0,
        0
      );


      expiryDate.setHours(
        0,
        0,
        0,
        0
      );


      const difference =
        expiryDate.getTime() -
        todayDate.getTime();


      insuranceDaysRemaining =
        Math.ceil(
          difference /
            (
              1000 *
              60 *
              60 *
              24
            )
        );


      if (
        insuranceDaysRemaining < 0
      ) {

        insuranceScore = 0;

      }

      else if (
        insuranceDaysRemaining <= 7
      ) {

        insuranceScore = 6;

      }

      else if (
        insuranceDaysRemaining <= 15
      ) {

        insuranceScore = 9;

      }

      else if (
        insuranceDaysRemaining <= 30
      ) {

        insuranceScore = 12;

      }

      else if (
        insuranceDaysRemaining <= 60
      ) {

        insuranceScore = 16;

      }

      else if (
        insuranceDaysRemaining <= 90
      ) {

        insuranceScore = 20;

      }

      else if (
        insuranceDaysRemaining <= 180
      ) {

        insuranceScore = 23;

      }

      else {

        insuranceScore = 25;

      }

    }


    // ===================================================
    // FINAL SCORE
    // ===================================================

    let healthScore =
      maintenanceScore +
      fuelEfficiencyScore +
      expenseScore +
      insuranceScore;


    // Ensure score is always between 0 and 100.

    healthScore =
      clamp(
        Math.round(
          healthScore
        ),
        0,
        100
      );


    // ===================================================
    // STATUS
    // ===================================================

    let status =
      "";

    let statusColor =
      "";


    if (
      healthScore >= 90
    ) {

      status =
        "Excellent";

      statusColor =
        "green";

    }

    else if (
      healthScore >= 75
    ) {

      status =
        "Good";

      statusColor =
        "green";

    }

    else if (
      healthScore >= 60
    ) {

      status =
        "Fair";

      statusColor =
        "yellow";

    }

    else if (
      healthScore >= 40
    ) {

      status =
        "Needs Attention";

      statusColor =
        "orange";

    }

    else {

      status =
        "Critical";

      statusColor =
        "red";

    }


    // ===================================================
    // RECOMMENDATIONS
    // ===================================================

    const recommendations =
      [];


    if (
      maintenanceScore < 25
    ) {

      recommendations.push(
        "Consider scheduling a vehicle service."
      );

    }


    if (
      fuelEfficiencyScore < 20
    ) {

      recommendations.push(
        "Fuel efficiency has decreased. Check tyre pressure, engine condition and driving habits."
      );

    }


    if (
      expenseScore < 16
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


    // If everything is healthy, provide
    // a positive recommendation.

    if (
      recommendations.length === 0
    ) {

      recommendations.push(
        "Continue regular maintenance and monitor your vehicle health."
      );

    }


    // ===================================================
    // RESPONSE
    // ===================================================

    res.status(200).json({

      success: true,

      vehicle: {

        id:
          vehicle._id,

        brand:
          vehicle.brand,

        model:
          vehicle.model,

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

          maxScore:
            30,

        },


        fuelEfficiency: {

          score:
            fuelEfficiencyScore,

          maxScore:
            25,

          currentEfficiency:
            currentEfficiency !==
            null
              ? round(
                  currentEfficiency,
                  2
                )
              : null,

        },


        expenses: {

          score:
            expenseScore,

          maxScore:
            20,

          currentMonthExpense:
            round(
              currentMonthExpense,
              2
            ),

          previousAverage:
            round(
              previousAverage,
              2
            ),

        },


        insurance: {

          score:
            insuranceScore,

          maxScore:
            25,

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