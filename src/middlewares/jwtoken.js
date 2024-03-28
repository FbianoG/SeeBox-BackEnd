const jwt = require('jsonwebtoken')
require('dotenv').config()
const secretKey = process.env.SECRET_KEY




async function verifyToken(req, res, next) { // validação do token
    const { token } = req.body // caso o token seja enviado via query (...?id=adf78y87ft2)
    if (!token) {
        return res.status(400).json({ auth: false, message: 'É necessário fazer login para acessar esta página.' })
    }
    try {
        const decoded = jwt.verify(token, secretKey) // caso o token seja válido, ele é decodificado - se não cai no CATCH
        req.userId = decoded.id // crio "tipo uma variáve" que é enviado no "next()" para ser consultada no controllers
        next()
    } catch (error) {
        return res.status(500).json({ auth: false, message: 'Sessão expirada. Faça login novamente.' })
    }
}
async function createToken(e) { // cria o token
    const token = await jwt.sign({ id: e }, secretKey, { expiresIn: "3h" }) //{id: "valor a ser criptografado"}, chave secreta, { expiresIn: 1h, 10m 30s}
    return token
}


module.exports = { createToken, verifyToken }