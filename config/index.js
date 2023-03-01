const dotenv = require('dotenv').config()




// Nodemailer
const gmailUser = process.env.gmail;
const gmailPass = process.env.gmailPass;
const adminMail = process.env.adminMail;
const userSubject = process.env.userSubject;



module.exports = {
    gmailUser,
    gmailPass,
    adminMail,
    userSubject,
}