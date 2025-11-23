require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend('re_Fzhg6uVo_DxikPcLAnHrQckRVRHAKh3tv');

const sendEmail = async (email,sub="Bharat safai abhiyan",content="Bharat safai abhiyan") => {
  try {
    await resend.emails.send({
      from: 'karanghorse91@gmail.com',
      to: email,
      subject: sub,
      text: content,
    });

    console.log("Verification email sent!");
  } catch (error) {
    console.error("Email send failed:", error.message);
  }
};

// okk agai
const OtpEmail = async (otp, email,sub) => {
  try {
    await resend.emails.send({
      from: 'karanghorse91@gmail.com',
      to: email,
      subject: sub,
      text: `Your OTP is: ${otp}. Expired in 10 minits`,
    });

    console.log("OTP email sent!");
  } catch (error) {
    console.error("Email send failed:", error.message);
  }
};

module.exports = { sendEmail, OtpEmail };
