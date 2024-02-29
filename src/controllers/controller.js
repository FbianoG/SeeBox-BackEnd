const { User, Leito } = require('../models/model')
const mid = require('../middlewares/jwtoken')
const path = require('path');
const { create } = require('domain');


async function login(req, res) {
    try {
        const { username, password } = req.body
        const userFind = await User.findOne({ username, password })
        if (!userFind) {
            return res.status(400).json({ message: "Nenhum usuário encontrado." })
        }
        const token = await mid.createToken(userFind._id)
        return res.status(200).json({ message: "Logado com sucesso!", token })
    } catch (error) {
        res.status(500).json({ message: "Erro de servidor" })
    }
}

async function getLeitos(req, res) {
    try {
        const leitos = await Leito.find({})
        return res.status(200).json({ leitos })
    } catch (error) {
        return res.status(500).json({ message: "Erro de servidor." })
    }
}


async function updateLeito(req, res) {
    try {
        const { id, name, plan, obs, nota, int, } = req.body

        const userFind = await Leito.findById({ _id: id })
        const salta = userFind.salta
        const alta = userFind.alta
        if (name == "" && plan == "") {
            salta == false
            alta == false
        }
        const userUpdate = await Leito.findByIdAndUpdate({ _id: id }, { name, plan, obs, nota, int, salta, alta })
        return res.status(201).json({ message: "Leito atualizado com sucesso." })
    } catch (error) {
        return res.status(500).json({ message: "Erro de servidor." })
    }
}

module.exports = { login, getLeitos, updateLeito }