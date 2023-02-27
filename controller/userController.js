const asyncHandler = require('express-async-handler')



// @descRegsiter a new User
// @route /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    // Validation
    if(!name || !email || !password){
        return res.status(400).json({ message: "Please Include all fields"})
    }



//     console.log(req.body)
   res.send("Register Routes")
})


const loginUser = (req, res) => {
    res.send('Login Route')
}


module.exports = {
    registerUser,
    loginUser,
}