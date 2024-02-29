const mongoose = require('mongoose')


async function connectDB() {
    try {
        await mongoose.connect("mongodb+srv://alta:123@cluster0.0envcid.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        console.log("Connected DataBase");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {connectDB}