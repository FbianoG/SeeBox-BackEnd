const express = require('express')
const router = require('./src/routes/router.js')
const DataBase = require('./src/dataBase/db.js')
require('dotenv').config()

const cors = require('cors')
const corsOptions = {
    origin: 'https://seebox.vercel.app',
    methods: ['GET', 'POST', 'PUT']
  }

const app = express()
const port = process.env.PORT

app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)

DataBase.connectDB()

app.listen(port, () => {
    console.log(`Servidor funcionando na porta:`, port)
})
