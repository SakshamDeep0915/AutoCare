const Vehicle = require("../models/Vehicle");
const Service = require("../models/Service");
const openrouter = require("../services/openrouterService");

exports.analyzeVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    // Get Vehicle
    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Get Services
    const services = await Service.find({
      vehicle: vehicleId,
    }).sort({ serviceDate: -1 });

    // AI Prompt
    const prompt = `
You are an expert automobile mechanic.

Analyze this vehicle and give a professional report.

Vehicle:
Brand: ${vehicle.brand}
Model: ${vehicle.model}
Year: ${vehicle.year}
Fuel Type: ${vehicle.fuelType}
Current Odometer: ${vehicle.odometer}

Service History:
${JSON.stringify(services, null, 2)}

Return exactly in this format:

Health Score: XX/100

Condition:
<2-3 lines>

Recommendations:
- Recommendation 1
- Recommendation 2
- Recommendation 3
- Recommendation 4
`;

    console.log("Calling OpenRouter...");

    const completion = await openrouter.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    console.log("OpenRouter Response Received");

    const analysis = completion.choices[0].message.content;

    res.status(200).json({
      success: true,
      analysis,
    });

  } catch (error) {
    console.error("Groq Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};