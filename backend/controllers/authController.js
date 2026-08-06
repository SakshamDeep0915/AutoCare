const PendingUser = require("../models/PendingUser");
const sendEmail = require("../utils/sendEmail");
const otpGenerator = require("otp-generator");

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.sendOTP = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if(!name || !phone || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Generate otp

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    // Hash Password

    const hashedPassword = await bcrypt.hash(password, 10);

    // Remove old pending request if exists

    await PendingUser.deleteOne({ email });

    // Save Pending User

    await PendingUser.create ({
      name,
      phone,
      email,
      password: hashedPassword,
      otp,
      expiresAt: new Date(Date.now() + 5*60*1000),
    });


    // Email Template

    const html = `
    <div style = "font-family: Arial; padding:20px">
    <h2> 🚗 AutoCare AI </h2>

    <p> Hello <b> ${name}</b>,</p>

    <p> Your OTP for Email Verification is </p>
    <h1 style="color:#2563eb"> ${otp} </h1>
    <p> This OTP is valid for <b> 5 Minutes </b>. </p>
    <hr/>

    <p> If you didn't request this, please ignore this email. </p>
    </div>
    `;

    await sendEmail(
      email,
      "AutoCare AI Email verification",
      html
    );

    res.status(200).json({
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try{
    const { email, otp } = req.body;

    if(!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const pendingUser = await PendingUser.findOne({ email });

    if(!pendingUser) {
      return res.status(400).json({
        success: false,
        message: "OTP request not found",
      });
    }

    // check OTP expiry

    if(pendingUser.expiresAt < new Date()) {
      await PendingUser.deleteOne({ email });

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify OTP
    if(pendingUser.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Create verified user

    const user = await User.create({
      name: pendingUser.name,
      phone: pendingUser.phone,
      email: pendingUser.email,
      password: pendingUser.password,
    });

    // Remove Pending user

    await PendingUser.deleteOne({ email });
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.status(201).json({
      success: true,
      message: "Email Verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =========================
// Register User
// =========================
/* exports.registerUser = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    // Validate input
    if (!name || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email },
        { phone }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}; */

// =========================
// Login User
// =========================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};