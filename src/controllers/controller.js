const { User, Leito } = require('../models/model')
const mid = require('../middlewares/jwtoken')




async function login(req, res) {
    try {
        const { username, password } = req.body
        const userFind = await User.findOne({ username, password })
        if (!userFind || !username || !password) {
            return res.status(400).json({ message: "Nenhum usuário encontrado." })
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
        const { id, name, plan, obs, nota, int, conc, } = req.body
        let { alta } = req.body
        if (!name) {
            alta = false
        }
        const userFind = await Leito.findById({ _id: id })
        if (userFind.alta == true && alta) {
            alta = false
        }
        const userUpdate = await Leito.findByIdAndUpdate({ _id: id }, { name, plan, obs, nota, conc, int, alta })
        return res.status(201).json({ message: "Leito atualizado com sucesso." })
    } catch (error) {
        console.error(error); // Log do erro para debug
        res.status(500).json({ error: "Erro interno do servidor." });
    }
}

module.exports = { login, getLeitos, updateLeito }