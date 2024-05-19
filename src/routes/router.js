const router = require('express').Router()
const control = require('../controllers/controller')
const mid = require("../middlewares/jwtoken")



router.post("/login", control.login)
// router.post("/createPatient", mid.verifyToken, control.createPatient)
router.post("/createPatient", mid.verifyToken, control.createPatient)
router.post("/getPatients", mid.verifyToken, control.getPatients)
router.post("/getPatientsAlta", mid.verifyToken, control.getPatientsAlta)
router.post("/uptadePatient", mid.verifyToken, control.uptadePatient)
router.post("/updateStatus", mid.verifyToken, control.updateStatus)
router.post("/updateRoom", mid.verifyToken, control.updateRoom)

router.post("/getLeitos", mid.verifyToken, control.getLeitos)
router.post("/updateLeito", mid.verifyToken, control.updateLeito)





module.exports = router