const { Patient } = require('../models/model')

async function verifyBox(box) {
    return await Patient.exists({ box, 'dataActive.activeMed': true })
}





module.exports = { verifyBox }