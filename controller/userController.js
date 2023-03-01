const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const { generateToken } = require('../utils/utilityFunction')
const { GenerateOTP, emailHtml, sendEmail } = require('../utils/notification')
const { adminMail, userSubject } = require('../config/index')





// @desc Regsiter a new User
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


    // Send Mail TO User with Nodemailer
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
})







// @desc  Resend Otp
// @route /api/users/verify-otp
// @access Public
const resendOtp = asyncHandler (async(req, res) => {
    const { email } = req.body
    
    // Find user by email
    const user = await User.findOne({ email: email})

    // Check if exist
    if(!user){
        res.status(400)
        throw new Error("You are not a registered user")
    }


    // check if user is verified
    if(user.verified){
        res.status(400)
        throw new Error("You are already verified")
      }

    


    // Generate new OTP and update user document
    const { otp, expiryTime } = GenerateOTP()
    user.otp = otp
    user.otpExpiry = expiryTime
    await user.save()

    //  console.log(otp)
    //  console.log(expiryTime)


    // Send Mail TO User with Nodemailer
    const html = emailHtml(otp, user.name)

    const sent = await sendEmail(adminMail, email, userSubject, html)


    if(sent){
        res.status(200).json({
          message: "OTP resent, check your email",
          token: generateToken(user._id)
        })
      }else{
        res.status(400)
        throw new Error("Please try again")
      }
})


















// @desc Verify a new User
// @route /api/users/verify-otp
// @access Private
const verifyUser = asyncHandler( async(req, res) => {
    const { otp } = req.body

    // Find user by id
    const user = await User.findById(req.user.id)

    // Check if otp is correct
    if(otp !== user.otp) {
        res.status(401)
        throw new Error('Invalid otp please Enter the Right otp')
    }


    // Check if OTP is still valid or Expired
    if (user.otpExpiry > new Date()) {
        res.status(401).send('Invalid OTP Or Expired OTP');
        return;
    }
    


    // OTP is valid, clear it from user document
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Login successful
    res.status(200).send('Login successful');

    // if(!user.otp === otp && user.otpExpiry >= new Date()){

    // }

})







const verifyUserVictor = asyncHandler( async(req, res) => {
    // if(req.user.id === null || req.user.id === undefined){
    //     res.status(401)
    //     throw new Error('Session expired. Request new OTP if registered')
    //   }
    
    const user = await User.findById(req.user.id)
    if (!user) {
        res.status(401)
        throw new Error('You are not registered')
    }
    
    const { otp } = req.body
    
    if (user.otp === otp && user.otpExpiry >= new Date()){
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {verified: true}, {new: true})
    if(updatedUser){
        res.status(201).json({
        message: 'Verification successful',
        updatedUser,
        token: generateToken(updatedUser.id),
        })
    }else{
        res.status(400)
        throw new Error('Verification failed')
    }
    }else{
    res.status(401)
        throw new Error('Invalid otp')
    }
})





















// @desc   Login a user
// @route  /api/users/login
// @access Public
// using try catch
const loginUsertryCatch = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if(user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
            })
        } else {
            res.status(401)
            throw new Error('Invalid Credentials')
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            Error: "Invalid credentials"
        })
    }
    
    // console.log(req.body)
    // res.send('Login Route')
}








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






// @descRegsiter a new User
// @route /api/users
// @access Public
const getMe = asyncHandler( async (req, res) => {
    const user = {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
    }
    res.status(200).json(user)
    // res.status(200).json(req.user)
})







module.exports = {
    registerUser,
    resendOtp,
    verifyUser,
    verifyUserVictor,
    loginUser,
    loginUsertryCatch,
    getMe
}