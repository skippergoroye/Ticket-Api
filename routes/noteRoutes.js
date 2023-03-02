const express = require('express')
const { addNote, getNotes} = require('../controller/notecontroller')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router({ mergeParams: true })


router.route('/').get(protect, getNotes).post(protect, addNote)




module.exports = router
