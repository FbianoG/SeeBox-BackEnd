const express = require('express')
const router = require('./src/routes/router')
const DataBase = require('./src/dataBase/db')


const app = express()
const port = 3000


app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)


app.listen(port, () => {
    DataBase.connectDB()
    console.log(`Servidor funcionando na porta:`, port)
})