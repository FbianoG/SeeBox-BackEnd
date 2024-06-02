const router = require('express').Router()
const control = require('../controllers/controller')
const mid = require("../middlewares/jwtoken")



router.post("/createUser", control.createUser)
router.post("/login", control.login)
// router.post("/createPatient", mid.verifyToken, control.createPatient)

router.post("/createPatient", mid.verifyToken, control.createPatient)
router.get("/getPatientsMed", mid.verifyToken, control.getPatientsMed)
router.get("/getPatientsRec", mid.verifyToken, control.getPatientsRec)
router.get("/getPatientsAlta", mid.verifyToken, control.getPatientsAlta)
router.put("/uptadeDataMed", mid.verifyToken, control.uptadeDataMed)
router.put("/archivePatient", mid.verifyToken, control.archivePatient)
router.put("/updateStatus", mid.verifyToken, control.updateStatus)
router.put("/updateRoom", mid.verifyToken, control.updateRoom)

router.post("/getLeitos", mid.verifyToken, control.getLeitos)
router.post("/updateLeito", mid.verifyToken, control.updateLeito)





module.exports = router