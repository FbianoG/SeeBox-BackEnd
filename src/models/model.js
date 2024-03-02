const mongoose = require('mongoose')

const User = mongoose.model("user", {
    username: String,
    password: String,
    roles: String,
})

const Leito = mongoose.model("leito", {
    name: String,
    age: String,
    plan: String,
    obs: String,
    alta: Boolean,
    nota: Boolean,
    conc: Boolean,
    pres: Boolean,
    exa: Boolean,
    int: Boolean,
    hour: String,
    inter: Boolean,
    stats: String
})

module.exports = { User, Leito }