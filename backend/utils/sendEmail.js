const axios = require("axios");

// ==========================================
// BREVO EMAIL API
// ==========================================

const sendEmail = async (to, subject, html) => {
  try {
    console.log(`Sending email to ${to} through Brevo...`);

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "AutoCare AI",
          email: process.env.EMAIL_USER,
        },

        to: [
          {
            email: to,
          },
        ],

        subject: subject,

        htmlContent: html,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log("Email sent successfully:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "BREVO EMAIL ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

module.exports = sendEmail;