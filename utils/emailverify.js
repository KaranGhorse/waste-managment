require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const emailVerify = async (token, email) => {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: email,
      subject: "Email Verification",
      text: `Verify your email: http://localhost:5173/verify/${token}`,
    });

    console.log("Verification email sent!");
  } catch (error) {
    console.error("Email send failed:", error.message);
  }
};

const resetPassEmail = async (otp, email) => {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: email,
      subject: "Reset Password OTP",
      text: `Your OTP is: ${otp}`,
    });

    console.log("OTP email sent!");
  } catch (error) {
    console.error("Email send failed:", error.message);
  }
};

module.exports = { emailVerify, resetPassEmail };
