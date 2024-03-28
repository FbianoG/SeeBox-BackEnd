const mongoose = require('mongoose')
require('dotenv').config()

async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_HOST)
        console.log("Connected DataBase");
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connectDB }