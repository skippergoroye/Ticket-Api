const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const { generateToken } = require('../utils/utilityFunction')
const { GenerateOTP, emailHtml, sendEmail } = require('../utils/notification')
const { adminMail, userSubject } = require('../config/index')



// @descRegsiter a new User
// @route /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body

    // Validation
    if(!name || !email || !password){
        return res.status(400).json({ message: "Please Include all fields"})
    }

    //Find if user already exist
    const userExist = await User.findOne({ email: email })


    if(userExist){
        res.status(400)
        throw new Error('User Already Exist')
    }


    // Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    

    // Generate OTP
    const { otp, expiryTime } = GenerateOTP()


    // Send Mail TO User
    const html = emailHtml(otp, name)

    const sent = await sendEmail(adminMail, email, userSubject, html)

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        verified: false,
        otp,
        otpExpiry: expiryTime
      })
    
      if (newUser && sent) {
        res.status(201).json({
          message: 'Registration successful, check mail for otp',
          newUser,
          token: generateToken(newUser._id),
        })
      } else {
        res.status(400)
        throw new Error('Invalid user data')
      }

    



    // // Create user
    // const user = await User.create({
    //     name,
    //     email,
    //     password: hashedPassword,
    // })


    // if(user){
    //     res.status(201).json({
    //         _id: user._id,
    //         name: user.name,
    //         email: user.email,
    //         token: generateToken(user._id)
    //     })
    // } else {
    //     res.status(400)
    //     throw new error('Invalid user data')
    // }
    
    // console.log(req.body)
})





// @desc   Login a user
// @route  /api/users/login
// @access Public



// using try catch
// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body

//         const user = await User.findOne({ email })

//         if(user && (await bcrypt.compare(password, user.password))) {
//             res.status(200).json({
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//             })
//         } else {
//             res.status(401)
//             throw new Error('Invalid Credentials')
//         }
        
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             Error: "Invalid credentials"
//         })
//     }
    
//     // console.log(req.body)
//     // res.send('Login Route')
// }







// using express-async-handler
const loginUser = asyncHandler (async (req, res) => {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            message: "User Login Successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid Credentials')
    }
    // console.log(req.body)
    // res.send('Login Route')
})







module.exports = {
    registerUser,
    loginUser,
}