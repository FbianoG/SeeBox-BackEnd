const mongoose = require('mongoose')

const User = mongoose.model("user", {
    username: String,
    password: String,
    roles: String,
})

const Leito = mongoose.model("leito", {
    name: String,
    plan: String,
    obs: String,
    alta: Boolean,
    nota: Boolean,
    conc: Boolean,
    int: Boolean,
})

module.exports = { User, Leito }