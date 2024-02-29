const router = require('express').Router()
const control = require('../controllers/controller')



router.post("/login", control.login)

router.get("/home", control.home)

router.get("/", control.a)



module.exports = router