const { Patient } = require('../models/model')

async function verifyBox(box) {
    return await Patient.findOne({ box, active: true })
}





module.exports = { verifyBox }