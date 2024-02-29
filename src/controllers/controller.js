const { User, Leito } = require('../models/model')
const mid = require('../middlewares/jwtoken')




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
        const { id, name, plan, obs, nota, int, conc } = req.body
        const userFind = await Leito.findById({ _id: id })
        let alta = userFind.alta
        if (name == "" && plan == "") {
            alta = false
        }
        const userUpdate = await Leito.findByIdAndUpdate({ _id: id }, { name, plan, obs, nota, conc, int, alta, })
        return res.status(201).json({ message: "Leito atualizado com sucesso." })
    } catch (error) {
        console.error(error); // Log do erro para debug
        res.status(500).json({ error: "Erro interno do servidor." });
    }
}

module.exports = { login, getLeitos, updateLeito }