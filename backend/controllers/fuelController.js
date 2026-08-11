const FuelExpense = require("../models/FuelExpense");
const Vehicle = require("../models/Vehicle");

// Add Fuel Expense

exports.addFuelExpense = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            vehicle,
            fuelDate,
            fuelType,
            quantity,
            pricePerUnit,
            odometer,
            fuelStation,
            notes,
        } = req.body;

        if(
            !vehicle ||
            !fuelDate ||
            !fuelType ||
            quantity === undefined ||
            pricePerUnit === undefined ||
            odometer === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        // Check vehicle belongs to logged-in user

        const vehicleExists = await Vehicle.findOne({
            _id: vehicle,
            user: userId,
        });

        if(!vehicleExists) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }

        // Calculate total fuel cost

        const totalCost = Number(quantity) * Number(pricePerUnit);
        const fuelExpense = await FuelExpense.create({
            vehicle,
            user: userId,
            fuelDate,
            fuelType,
            quantity,
            pricePerUnit,
            totalCost,
            odometer,
            fuelStation,
            notes,
        });

        res.status(201).json({
            success: true,
            message: "Fuel expense added successfully",
            fuelExpense,
        });
    } catch (error) {
        console.error("Add Fuel Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Get Fuel History

exports.getFuelHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { vehicleId } = req.params;

        const vehicle = await Vehicle.findOne({
            _id: vehicleId,
            user: userId,
        });

        if(!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }

        const fuelExpenses = await FuelExpense.find({
            vehicle: vehicleId,
            user: userId,
        }).sort({
            fuelDate: -1,
        });

        res.status(200).json({
            success: true,
            fuelExpenses,
        });
    } catch (error) {
        console.error("Fuel History Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Delete Fuel Expense

exports.deleteFuelExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const fuelExpense = await FuelExpense.findOneAndDelete({
            _id: id,
            user: userId,
        });

        if(!fuelExpense) {
            return res.status(404).json({
                success: false,
                message: "Fuel expense not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Fuel expense deleted successfully",
        });
    } catch (error) {
        console.error("Delete Fuel Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};