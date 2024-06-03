const { User, Leito, Patient } = require('../models/model')
const mid = require('../middlewares/jwtoken')
const bcpt = require('../middlewares/bcrypt')
const bcrypt = require('bcrypt')
const { verifyBox } = require('../middlewares/utils')


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
            stats = ""
            hour = ""
            room = ""
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

// New
async function login(req, res) {
    try {
        const { username, password } = req.body.data
        if (!username || !password) return res.status(400).json({ message: "Preencha todos os campos." })
        const userFind = await User.findOne({ username })
        if (!userFind) return res.status(401).json({ message: "Usuário ou senha inválidos." })
        const result = await bcrypt.compare(password, userFind.password)
        if (!result) return res.status(401).json({ message: "Usuário ou senha inválidos." })
        const token = await mid.createToken(userFind._id)
        return res.status(200).json({ auth: true, roles: userFind.roles, message: "Logado com sucesso!", token })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erro interno do servidor." })
    }
}

async function createUser(req, res) {
    let { username, password, secundPassword, key } = req.body
    console.log(req.body)
    try {
        if (!username, !password, !key) return res.status(400).json({ message: 'Preencha todos os campos.' })
        if (key === 'm3d') roles = 'med'
        else if (key === 'r3c') roles = 'rec'
        else if (key === 'g3r') roles = 'ger'
        else return res.status(400).json({ message: 'Key não validada pelo Adm.' })
        if (password != secundPassword) return res.status(400).json({ message: 'As senhas não conferem.' })
        const existUser = await User.exists({ username })
        if (existUser) return res.status(400).json({ message: 'Este login já está sendo utilizado por outro usuário.' })
        const hashPassword = await bcpt.hashPassword(password)
        const newUser = await User.create({ username, password: hashPassword, roles })
        return res.status(201).json({ message: 'Usuário criado com sucesso!' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Erro interno de servidor.' })
    }
}

async function createPatient(req, res) {
    const { name, age, plan, box, spec } = req.body.data
    try {
        if (!name || !age || !plan || !box || !spec) return res.status(400).json({ message: "Preencha todos os campos." })
        const findBox = await verifyBox(box)
        if (findBox) return res.status(400).json({ message: 'Já possui paciente cadastrado neste leito.' })
        const response = await Patient.create({ name, age, plan, box, stats: 'indefinido', dataActive: { activeMed: true, activeEnf: true, activeRec: true }, dataMed: { spec }, dataTime: { timeCreate: new Date() } })
        return res.status(201).json({ message: 'Paciente incluído com sucesso!' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servido.' })
    }
}

async function getPatientsMed(req, res) {
    try {
        const patients = await Patient.find({ 'dataActive.activeMed': true }).select('-dataTime.timeAna -dataTime.timeAlta -dataActive')
        return res.status(200).json({ patients })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servidor.' })
    }
}

async function getPatientsEnf(req, res) {
    try {
        const patients = await Patient.find({ 'dataActive.activeEnf': true }).select('-dataTime.timeAna -dataTime.timeAlta -dataActive')
        return res.status(200).json({ patients })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servidor.' })
    }
}

async function getPatientsRec(req, res) {
    try {
        const patients = await Patient.find({ 'dataActive.activeRec': true }).select('-dataTime.timeAna -dataTime.timeAlta -dataMed')
        return res.status(200).json({ patients })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servidor.' })
    }
}

async function getPatientsAlta(req, res) { // Paciente de alta médica
    try {
        const altaPatients = await Patient.find({ alta: { $ne: 'outros' } }).sort({ timeCreate: -1 }).limit(70)
        return res.status(200).json({ altaPatients })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servidor.' })
    }
}

async function uptadeDataMed(req, res) {
    const { _id, dataMed, box } = req.body
    // delete data.box
    try {
        if (!_id || _id.trim() === '' || !dataMed || !box) return res.status(400).json({ message: 'Paciente não encontrado.' })
        const findBox = await verifyBox(box) // verifica se o 'box' já está ativo
        if (findBox && findBox._id != _id) return res.status(400).json({ message: 'Já possui paciente cadastrado neste leito.' })
        const update = await Patient.findByIdAndUpdate({ _id }, { box, dataMed })
        if (!update) return res.status(400).json({ message: 'Paciente não encontrado.' })
        return res.status(200).json({ message: 'Paciente atualizado com sucesso!' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servidor.' })
    }
}

async function archivePatient(req, res) {
    const { _id, alta, sendBy } = req.body
    try {
        if (!_id || _id.trim() === '') return res.status(400).json({ message: 'Paciente não encontrado.' })
        const update = await Patient.findByIdAndUpdate({ _id }, { alta, $set: { 'dataTime.timeArchive': new Date(), [`dataActive.active${sendBy}`]: false } })
        if (!update) return res.status(400).json({ message: 'Paciente não encontrado.' })
        return res.status(200).json({ message: 'Paciente arquivado com sucesso!' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servidor.' })
    }
}

async function updateStatus(req, res) {
    let { _id, stats, timeAna, timeInt, timeAlta } = req.body
    let update
    try {
        if (!_id || !stats) return res.status(400).json({ message: 'Dados não fornecidos.' })
        if (timeAna) update = await Patient.findByIdAndUpdate({ _id }, { $set: { stats, 'dataTime.timeAna': new Date() }, $unset: { 'dataTime.timeInt': "", 'dataTime.timeAlta': "" } })
        else if (timeAlta) update = await Patient.findByIdAndUpdate({ _id }, { $set: { stats, 'dataTime.timeAlta': new Date() }, $unset: { 'dataTime.timeInt': "" } })
        else if (timeInt) update = await Patient.findByIdAndUpdate({ _id }, { stats, 'dataTime.timeInt': new Date() })
        else update = await Patient.findByIdAndUpdate({ _id }, { $set: { stats }, $unset: { 'dataTime.timeInt': "", 'dataTime.timeAlta': "", 'dataTime.timeAna': "" } })
        if (!update) return res.status(404).json({ message: 'Paciente não encontrado.' })
        return res.status(200).json({ message: 'Alteração realizada com sucesso!' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servidor' })
    }
}

async function updateRoom(req, res) {
    const { _id, room } = req.body
    try {
        if (!_id) return res.status(400).json({ message: 'Paciente não encontrado.' })
        const update = await Patient.findByIdAndUpdate({ _id }, { room })
        if (!update) return res.status(404).json({ message: 'Paciente não encontrado.' })
        return res.status(200).json({ message: 'Leito atualizado com sucesso!' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servidor' })
    }
}

module.exports = { createUser, login, getLeitos, updateLeito, createPatient, getPatientsMed, getPatientsEnf, getPatientsRec, getPatientsAlta, uptadeDataMed, archivePatient, updateStatus, updateRoom }