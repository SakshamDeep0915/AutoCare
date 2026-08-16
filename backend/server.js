const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes = require("./routes/aiRoutes");
const fuelRoutes = require("./routes/fuelRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const alertRoutes = require("./routes/alertRoutes");
const healthScoreRoutes = require("./routes/healthScoreRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/fuel", fuelRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/health-score", healthScoreRoutes);

const authMiddleware = require("./middleware/authMiddleware");

app.get("/test-auth", authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});


// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚗 AutoCare AI Backend Running...",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});