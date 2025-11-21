const crypto = require("crypto");

const uniqueReferralCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const randomBuffer = crypto.randomBytes(8);

  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[randomBuffer[i] % chars.length];
  }

  return code;
};

const randomOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


module.exports = {
    randomOtp,
    uniqueReferralCode
}