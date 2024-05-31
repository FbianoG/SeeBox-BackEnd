const { Patient } = require('../models/model')

async function verifyBox(box) {
    return await Patient.exists({ box, active: true })
}





module.exports = { verifyBox }