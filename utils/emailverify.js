// Filename - tokenSender.js

const nodemailer = require('nodemailer');
require('dotenv').config()
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

 const emailVerify = (token, email)=>{
    const mailConfigurations = {
    
        // It should be a string of sender/server email
        from: process.env.MAIL_USER,
    
        to: email,
    
        // Subject of Email
        subject: 'Email Verification',
        
        // This would be the text of email body
        text: `Hi! There, You have recently visited 
               our website and entered your email.
               Please follow the given link to verify your email
               http://localhost:5173/verify/${token} 
               Thanks`
    };
    
    transporter.sendMail(mailConfigurations, function(error, info){
        if (error) return console.error("Email send failed:", error);
        console.log('Email Sent Successfully');
        // console.log(info);
    }); 

}
 const resetPassEmail = (otp, email)=>{
    const mailConfigurations = {
    
        // It should be a string of sender/server email
        from: process.env.MAIL_USER,
    
        to: email,
    
        // Subject of Email
        subject: 'Reset Password email',
        
        // This would be the text of email body
        text: `Hi! There, You have Forgot password 
              
               OTP is ${otp}
               Thanks`
    };
    
    transporter.sendMail(mailConfigurations, function(error, info){
        if (error) return console.error("Email send failed:", error.message);
        console.log('Email Sent Successfully');
        // console.log(info);
    }); 

}

// const resetPassEmail = (token,email)=>{
//     const mailConfigurations = {
    
//         // It should be a string of sender/server email
//         from: process.env.MAIL_USER,
    
//         to: email,
    
//         // Subject of Email
//         subject: 'Passwor Reset OTP',
        
//         // This would be the text of email body
//         html: `<p>Your OTP for password reset is <b>${otp}</b></p>`
//     };
    
//     transporter.sendMail(mailConfigurations, function(error, info){
//         if (error) throw Error(error);
//         console.log('OTP Sent Successfully');
//         console.log(info);
//     }); 
// }


module.exports = {emailVerify,resetPassEmail}