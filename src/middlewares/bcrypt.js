const bcrypt = require('bcrypt')



async function comparePassword(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash)
}


module.exports = { comparePassword }