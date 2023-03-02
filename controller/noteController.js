const asyncHandler = require('express-async-handler')

const Note = require('../models/noteModel')
const User = require('../models/userModel')
const Ticket = require('../models/ticketModel')





// @desc   Get notes for a tickets
// @route  Get /api/tickets/:ticketId/notes
// @access Private
const getNotes = asyncHandler( async (req, res)=> {



    const user = await User.findById(req.user.id)
    if (!user) {
      res.status(401)
      throw new Error('User not found')
    }
  
    const ticket = await Ticket.findById(req.params.ticketId)
  
    if (ticket.user.toString() !== req.user.id) {
      res.status(401)
      throw new Error('User not authorized')
    }
  
    const notes = await Note.find({ ticket: req.params.ticketId })
  
    res.status(200).json({
      message: 'Successful',
      notes,
    })
})



// @desc   Creae ticket note
// @route  Get /api/tickets/:ticketId/notes
// @access Private

const addNote = asyncHandler( async (req, res)=> {
    const user = await User.findById(req.user.id)
    if (!user) {
      res.status(401)
      throw new Error('User not found')
    }
  
    const ticket = await Ticket.findById(req.params.ticketId)
  
    if (ticket.user.toString() !== req.user.id) {
      res.status(401)
      throw new Error('User not authorized')
    }
  
    const notes = await Note.create({
        text: req.body.text,
        isStaff: false,
        ticket: req.params.ticketId,
        user: req.user.id,
    })
  
    res.status(200).json(notes)
})




module.exports = {
    getNotes,
    addNote
    
}