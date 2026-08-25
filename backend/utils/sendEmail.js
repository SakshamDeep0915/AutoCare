const nodemailer = require("nodemailer");

// ==========================================
// GMAIL SMTP TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,

  family: 4,

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==========================================
// SEND EMAIL
// ==========================================

const sendEmail = async (to, subject, html) => {
  try {
    console.log("Connecting to Gmail SMTP...");

    await transporter.sendMail({
      from: `"AutoCare AI" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    throw error;
  }
};

module.exports = sendEmail;