const mongoose = require('mongoose')
const colors = require('colors')


const connectDB = async() => {
    try {
        mongoose.set('strictQuery', true)
        const conn = mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDb Connected: ${conn.connection}`.cyan.underline)
    } catch (error) {
        console.log(`Error: ${error.message}`.red.underline.bold)
        process.exit(1)
    }
}


module.exports = connectDB