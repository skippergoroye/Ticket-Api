const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')
const Ticket = require('../models/ticketModel')



// @desc   Get User tickets
// @route  Get /api/users
// @access Private
const getTickets = asyncHandler( async (req, res)=> {
    // Get User using the id in  the JWT
    const user = await User.findById(req.user.id)

    if(!user){
        res.status(401)
        throw new Error('User Not found')
    }

    const tickets = await Ticket.find({ user: req.user.id })

    res.status(200).json(tickets)
})





// @desc   Create new tickets
// @route  POST /api/users
// @access Private
const createTicket = asyncHandler(async(req, res) => {
    const { product, description } = req.body

    if(!product || !description) {
      res.status(400)
      throw new Error("Please add a product and description")
    }


    // Get user using the id in the jwt
    const user = await User.findById(req.user.id)

    if(!user) {
      req.status(401)
      throw new Error('User not found')
    }

    const ticket = await Ticket.create({
        product,
        description,
        user: req.user.id,
        status: 'new'
    })

    res.status(201).json({ ticket })
})


module.exports = {
    getTickets,
    createTicket 
}