const mongoose = require("mongoose");

const fuelExpenseSchema = new mongoose.Schema(
    {
        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        fuelDate: {
            type: Date,
            required: true,
        },

        fuelType: {
            type: String,
            enum: ["Petrol", "Diesel", "CNG", "Electric"],
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 0,
        },

        pricePerUnit: {
            type: Number,
            required: true,
            min: 0,
        },

        totalCost: {
            type: Number,
            required: true,
            min: 0,
        },

        odometer: {
            type: Number,
            required: true,
            min: 0,
        },

        fuelStation: {
            type: String,
            default: "",
        },

        notes: {
            type: String,
            default: "",
        },

    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model("FuelExpense", fuelExpenseSchema);