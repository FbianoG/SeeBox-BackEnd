const { User } = require('../models/model')



async function login(req, res) {
    try {
        const { username, password } = req.body
        const userFind = await User.findOne({ username, password })
        if (!userFind) {
            return res.status(400).json({message:"Nenhum usuário encontrado."})
        }
        console.log(userFind);
        res.status(200).json({ message: "Logado com sucesso!" })
    } catch (error) {
        res.status(500).json({ message: "Erro de servidor" })
    }
}


module.exports = { login }