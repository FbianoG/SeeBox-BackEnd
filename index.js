const express = require('express')
const router = require('./src/routes/router.js')
const DataBase = require('./src/dataBase/db.js')
const rateLimit = require('express-rate-limit');
require('dotenv').config()

const cors = require('cors')

const corsOptions = {
  origin: 'https://seebox.vercel.app',
  methods: ['GET', 'POST', 'PUT']
}

const limiter = rateLimit({
  windowMs:  60 * 1000, 
  max: 20,
  message: 'Muitas requisições, tente depois!',
  headers: true, 
});


const app = express()
const port = process.env.PORT
// app.use(limiter);
app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)

DataBase.connectDB()

app.listen(port, () => {
  console.log(`Servidor funcionando na porta:`, port)
})
