const { User, Leito } = require('../models/model')
const mid = require('../middlewares/jwtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10





async function login(req, res) {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).json({ message: "Preencha todos os campos." })
        }
        const userFind = await User.findOne({ username })
        if (!userFind) {
            return res.status(401).json({ message: "Nenhum usuário encontrado." })
        }
        const result = await bcrypt.compare(password, userFind.password)
        if (!result) {
            return res.status(401).json({ message: "Nenhum usuário encontrado." })
        }
        const token = await mid.createToken(userFind._id)
        return res.status(200).json({ auth: true, roles: userFind.roles, message: "Logado com sucesso!", token })
    } catch (error) {
        console.error(error); // Log do erro para debug
        res.status(500).json({ error: "Erro interno do servidor." });
    }
}

async function getLeitos(req, res) {
    try {
        const leitos = await Leito.find({})
        return res.status(200).json({ leitos })
    } catch (error) {
        console.error(error); // Log do erro para debug
        res.status(500).json({ error: "Erro interno do servidor." });
    }
}


async function updateLeito(req, res) {
    try {
        const { id, name, age, plan, obs, nota, conc, pres, exa, tev, int, } = req.body
        let { hour, stats, room } = req.body

        if (!name || name.trim() == "") {
            stats = undefined
            hour = undefined
            room = undefined
        }
        const userFind = await Leito.findById({ _id: id })
        console.log(req.body);
        const userUpdate = await Leito.findByIdAndUpdate({ _id: id }, { name, age, plan, obs, nota, conc, pres, exa, tev, int, hour, stats, room }, { new: true })
        return res.status(201).json({ status: 201, message: "Leito atualizado com sucesso.", userUpdate })
    } catch (error) {
        console.error(error); // Log do erro para debug
        res.status(500).json({ error: "Erro interno do servidor." });
    }
}

module.exports = { login, getLeitos, updateLeito }