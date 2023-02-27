const express = require('express')
const colors =  require('colors')
const userRoutes = require('./routes/userRoutes')
// const { errorHandler } = require('./middleware/errorMiddleware')
const dotenv = require('dotenv').config()


const app = express()



app.use(express.json())
app.use(express.urlencoded({ extended: false }))



const PORT = process.env.PORT || 8000


app.get('/', (req, res) => {
   res.status(200).json({ message: "welcome to the suppor desk api" })
})


// Routes
app.use('/api/users', userRoutes)



// app.use(errorHandler)



app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})