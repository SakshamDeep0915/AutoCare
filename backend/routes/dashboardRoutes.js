const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    getDashboard,
    getMonthlyExpenses
} = require("../controllers/dashboardController");

router.get("/", authMiddleware, getDashboard);
module.exports = router;

router.get("/monthly-expenses", authMiddleware, getMonthlyExpenses);