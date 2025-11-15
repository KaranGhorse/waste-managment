require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend('re_Fzhg6uVo_DxikPcLAnHrQckRVRHAKh3tv');

const emailVerify = async (token, email) => {
  try {
    await resend.emails.send({
      from: 'karanghorse91@gmail.com',
      to: email,
      subject: "Email Verification",
      text: `Verify your email: http://localhost:5173/verify/${token}`,
    });

    console.log("Verification email sent!");
  } catch (error) {
    console.error("Email send failed:", error.message);
  }
};

// okk agai
const resetPassEmail = async (otp, email) => {
  try {
    await resend.emails.send({
      from: 'karanghorse91@gmail.com',
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
