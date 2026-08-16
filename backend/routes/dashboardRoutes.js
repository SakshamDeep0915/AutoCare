const express = require("express");

const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const protect = require("../middleware/authMiddleware");


// Dashboard
router.get(
  "/",
  protect,
  dashboardController.getDashboard
);


// Monthly Expenses
router.get(
  "/monthly-expenses",
  protect,
  dashboardController.getMonthlyExpenses
);


// Expense Report
router.get(
  "/expense-report",
  protect,
  dashboardController.getExpenseReport
);


module.exports = router;