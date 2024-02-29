const express = require('express')
const router = require('./src/routes/router.js')
const DataBase = require('./src/dataBase/db.js')

const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)

DataBase.connectDB()

app.listen(port, () => {
    console.log(`Servidor funcionando na porta:`, port)
})
