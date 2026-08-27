const Vehicle = require("../models/Vehicle");
const Service = require("../models/Service");
const FuelExpense = require("../models/FuelExpense");

const openrouter =
  require("../services/openrouterService");


// =====================================================
// CALCULATE DETERMINISTIC VEHICLE HEALTH SCORE
// =====================================================

const calculateHealthScore = async ({
  vehicle,
  services,
  fuelRecords,
  userId,
}) => {

  // ===================================================
  // 1. MAINTENANCE SCORE - 30
  // ===================================================

  let maintenanceScore = 30;


  if (services.length === 0) {

    maintenanceScore = 10;

  } else {

    const latestService =
      services[0];


    const distanceSinceService =
      Number(vehicle.odometer) -
      Number(latestService.odometer);


    if (distanceSinceService >= 5000) {

      maintenanceScore = 10;

    } else if (distanceSinceService >= 4000) {

      maintenanceScore = 20;

    } else {

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

      } else if (
        currentEfficiency >=
        averageEfficiency * 0.85
      ) {

        fuelEfficiencyScore = 20;

      } else if (
        currentEfficiency >=
        averageEfficiency * 0.70
      ) {

        fuelEfficiencyScore = 15;

      } else {

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


  // ===================================================
  // SERVICE EXPENSES
  // ===================================================

  const serviceExpenses =
    await Service.find({

      vehicle: vehicle._id,

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

      vehicle: vehicle._id,

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


  // ===================================================
  // PROCESS SERVICE EXPENSES
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
  // PROCESS FUEL EXPENSES
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

  } else if (
    previousAverage > 0 &&
    currentMonthExpense >
      previousAverage * 1.25
  ) {

    expenseScore = 14;

  } else {

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

    } else if (
      insuranceDaysRemaining <= 30
    ) {

      insuranceScore = 10;

    } else if (
      insuranceDaysRemaining <= 90
    ) {

      insuranceScore = 18;

    } else {

      insuranceScore = 25;

    }

  }


  // ===================================================
  // FINAL SCORE
  // ===================================================

  const healthScore =
    Math.round(
      maintenanceScore +
      fuelEfficiencyScore +
      expenseScore +
      insuranceScore
    );


  return {

    healthScore,

    maintenanceScore,

    fuelEfficiencyScore,

    expenseScore,

    insuranceScore,

    currentEfficiency,

    currentMonthExpense,

    previousAverage,

    insuranceDaysRemaining,

  };

};


// =====================================================
// AI VEHICLE ANALYSIS
// =====================================================

exports.analyzeVehicle = async (
  req,
  res
) => {

  try {

    const {
      vehicleId,
    } = req.params;


    const userId =
      req.user.id;


    // =================================================
    // GET VEHICLE
    // =================================================

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


    // =================================================
    // GET SERVICES
    // =================================================

    const services =
      await Service.find({

        vehicle: vehicleId,

        user: userId,

      }).sort({

        serviceDate: -1,

      });


    // =================================================
    // GET FUEL RECORDS
    // =================================================

    const fuelRecords =
      await FuelExpense.find({

        vehicle: vehicleId,

        user: userId,

      }).sort({

        odometer: 1,

      });


    // =================================================
    // CALCULATE FIXED HEALTH SCORE
    // =================================================

    const score =
      await calculateHealthScore({

        vehicle,

        services,

        fuelRecords,

        userId,

      });


    console.log(
      "Deterministic Health Score:",
      score.healthScore
    );


    // =================================================
    // AI PROMPT
    // =================================================

    const prompt = `

You are an expert automobile mechanic.

Analyze this vehicle and provide a professional
vehicle health report.

IMPORTANT:

The numerical Health Score has already been
calculated by AutoCare AI using a deterministic
scoring system.

You MUST use this exact Health Score:

${score.healthScore}/100

DO NOT change, estimate, recalculate or invent
a different Health Score.

Vehicle:

Brand:
${vehicle.brand}

Model:
${vehicle.model}

Year:
${vehicle.year}

Fuel Type:
${vehicle.fuelType}

Current Odometer:
${vehicle.odometer}

Service History:

${JSON.stringify(
  services,
  null,
  2
)}

Fuel History:

${JSON.stringify(
  fuelRecords,
  null,
  2
)}

Score Breakdown:

Maintenance:
${score.maintenanceScore}/30

Fuel Efficiency:
${score.fuelEfficiencyScore}/25

Expenses:
${score.expenseScore}/20

Insurance:
${score.insuranceScore}/25


Return exactly in this format:

Health Score: ${score.healthScore}/100

Condition:
<2-3 professional lines explaining the current
vehicle condition based on the supplied data>

Recommendations:
- Recommendation 1
- Recommendation 2
- Recommendation 3
- Recommendation 4

IMPORTANT:
The Health Score MUST remain exactly
${score.healthScore}/100.

`;


    console.log(
      "Calling OpenRouter..."
    );


    // =================================================
    // OPENROUTER
    // =================================================

    const completion =
      await openrouter.chat.completions.create({

        model:
          "openrouter/free",

        messages: [

          {
            role: "user",

            content:
              prompt,

          },

        ],

        temperature: 0.2,

      });


    console.log(
      "OpenRouter Response Received"
    );


    let analysis =
      completion
        .choices?.[0]
        ?.message
        ?.content || "";


    // =================================================
    // FORCE THE DETERMINISTIC SCORE
    // =================================================
    // Even if the AI ignores the instruction and
    // returns another score, replace it with the
    // backend-calculated score.
    // =================================================

    const aiScorePattern =
      /Health Score:\s*\d+\s*\/\s*100/i;


    if (
      aiScorePattern.test(
        analysis
      )
    ) {

      analysis =
        analysis.replace(
          aiScorePattern,
          `Health Score: ${score.healthScore}/100`
        );

    } else {

      analysis =
        `Health Score: ${score.healthScore}/100\n\n` +
        analysis;

    }


    // =================================================
    // RESPONSE
    // =================================================

    res.status(200).json({

      success: true,

      analysis,

      healthScore:
        score.healthScore,

      breakdown: {

        maintenance: {
          score:
            score.maintenanceScore,

          maxScore: 30,
        },

        fuelEfficiency: {
          score:
            score.fuelEfficiencyScore,

          maxScore: 25,

          currentEfficiency:
            score.currentEfficiency
              ? Number(
                  score.currentEfficiency.toFixed(
                    2
                  )
                )
              : null,
        },

        expenses: {
          score:
            score.expenseScore,

          maxScore: 20,

          currentMonthExpense:
            Number(
              score.currentMonthExpense.toFixed(
                2
              )
            ),

          previousAverage:
            Number(
              score.previousAverage.toFixed(
                2
              )
            ),
        },

        insurance: {
          score:
            score.insuranceScore,

          maxScore: 25,

          daysRemaining:
            score.insuranceDaysRemaining,
        },

      },

    });


  } catch (error) {

    console.error(
      "AI Analysis Error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};