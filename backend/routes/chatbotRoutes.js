const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  vehicleChatbot,
} = require("../controllers/chatbotController");

router.post(
  "/",
  authMiddleware,
  vehicleChatbot
);

module.exports = router;