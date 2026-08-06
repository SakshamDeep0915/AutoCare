const express = require("express");
const router = express.Router();

const {
  sendOTP,
  verifyOTP,
 // registerUser,
  loginUser,
} = require("../controllers/authController");

router.post("/send-otp", sendOTP);

router.post("/verify-otp", verifyOTP);

// Register User
// router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

module.exports = router;