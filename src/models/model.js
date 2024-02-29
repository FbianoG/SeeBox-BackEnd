const mongoose = require('mongoose')

const User = mongoose.model("user", {
    username: String,
    password: String,
})

const Leito = mongoose.model("leito", {
    name: String,
    plan: String,
    obs: String,
    salt: Boolean,
    alta: Boolean,
    nota: Boolean,
    conc: Boolean,
    int: Boolean,
})

module.exports = { User, Leito }