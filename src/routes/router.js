const router = require('express').Router()
const control = require('../controllers/controller')
const mid = require("../middlewares/jwtoken")



router.post("/login", control.login)

router.post("/getLeitos", mid.verifyToken, control.getLeitos)
router.post("/updateLeito", mid.verifyToken, control.updateLeito)





module.exports = router