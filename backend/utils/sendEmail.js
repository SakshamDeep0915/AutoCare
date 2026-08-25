const { Resend } = require("resend");

// ==========================================
// RESEND EMAIL CLIENT
// ==========================================

const resend = new Resend(process.env.RESEND_API_KEY);


// ==========================================
// SEND EMAIL
// ==========================================

const sendEmail = async (to, subject, html) => {
  try {
    console.log("Sending email through Resend...");

    const { data, error } = await resend.emails.send({
      from: "AutoCare AI <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("RESEND EMAIL ERROR:", error);
      throw new Error(error.message || "Failed to send email");
    }

    console.log("Email sent successfully:", data);

    return data;
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    throw error;
  }
};


module.exports = sendEmail;