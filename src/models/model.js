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
    nota: Boolean,
    conc: Boolean,
    pres: Boolean,
    exa: Boolean,
    tev: Boolean,
    int: Boolean,
    hour: String,
    stats: String,
    room: String,
})

module.exports = { User, Leito }