const router = require('express').Router()
const control = require('../controllers/controller')



router.post("/login", control.login)



module.exports = router