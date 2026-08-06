const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },

    model: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },

    registrationType: {
      type: String,
      enum: ["Private", "Commercial"],
      required: true,
    },

    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"],
      required: true,
    },

    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      required: true,
    },

    odometer: {
      type: Number,
      required: true,
    },

    owners: {
      type: Number,
      required: true,
    },

    insuranceExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);