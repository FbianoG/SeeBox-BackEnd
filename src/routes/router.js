const router = require('express').Router()
const control = require('../controllers/controller')



router.post("/login", control.login)

router.post("/home", control.home)



module.exports = router