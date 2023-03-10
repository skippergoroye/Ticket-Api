const nodemailer = require('nodemailer')
const {
    gmailUser,
    gmailPass,
    adminMail,
    userSubject,
} = require('../config/index')



// Algorithms To generate Otp
const GenerateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
  
    const expiryTime = new Date();
  
    expiryTime.setTime(new Date().getTime() + 5 * 60 * 1000); // OTP expires in 5 minutes
    return { otp, expiryTime };
};




// Nodemailer config
const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
});




const sendEmail =  (from, to, subject, html) => {
    try {
      const response =  transport.sendMail({
        from: adminMail,
        to,
        subject: userSubject,
        html,
      })
      return response
    } catch (error) {
      console.log(error)
    }
}



const emailHtml = (otp, name="there") => {
    let result = `
     <div style = "max-width:700px; margin: auto; border: 10px solid #ddd; padding: 50px, 20px; font-size: 110%;">
     <h2 style = "text-align: center; text-transform: uppercase; color: teal;">
     Welcome to Support Desk
     </h2>
     <p>
      Hi ${name}, your OTP is ${otp}. It expires in 5 minutes.
     </p>
     </div>
     `
    return result
}




  


module.exports = {
    GenerateOTP,
    sendEmail,
    emailHtml
}
  