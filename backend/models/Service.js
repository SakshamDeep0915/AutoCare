const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
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

    serviceType: {
      type: String,
      required: true,
      trim: true,
    },

    serviceCenter: {
      type: String,
      required: true,
      trim: true,
    },

    serviceDate: {
      type: Date,
      required: true,
    },

    odometer: {
      type: Number,
      required: true,
    },

    cost: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);